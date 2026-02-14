# Plano de Correções — LinkPage

> Gerado em: 2026-02-14
> Baseado em revisão completa de Segurança, Qualidade de Código e Infraestrutura

---

## Visão Geral

| Fase | Prioridade | Issues | Estimativa |
|------|-----------|--------|-----------|
| **Fase 0** | Bloqueante | 3 | Imediato |
| **Fase 1** | Crítica | 7 | Sprint 1 |
| **Fase 2** | Alta | 10 | Sprint 2 |
| **Fase 3** | Média | 12 | Sprint 3 |
| **Fase 4** | Baixa/Melhoria | 8+ | Backlog |

---

## Fase 0 — Bloqueante (Antes de qualquer commit público)

### 0.1 Corrigir `.gitignore`
- **Severidade:** CRÍTICA
- **Arquivo:** `.gitignore`
- **Problema:** Faltam entradas para `.env`, `.env.*` e `supabase/.temp/`
- **Status:** ✅ CORRIGIDO
- **Ação:** Adicionadas entradas para proteger credenciais

### 0.2 Corrigir trigger `handle_new_user` — `SECURITY DEFINER` sem `search_path`
- **Severidade:** CRÍTICA
- **Arquivo:** `supabase/migrations/20260214000001_initial_schema.sql:83-98`
- **Problemas:**
  - Vulnerável a `search_path` hijacking
  - Falha quando `username` é NULL (login social, magic link)
  - Sem tratamento de erro (`BEGIN...EXCEPTION`)
- **Ação:**
  1. Adicionar `SET search_path = public` na declaração da função
  2. Adicionar `COALESCE` para username com fallback baseado no UUID
  3. Envolver o INSERT em `BEGIN...EXCEPTION` para capturar erros de constraint
  4. Criar nova migration: `20260215000001_fix_handle_new_user.sql`

### 0.3 Remover `dangerouslySetInnerHTML` desnecessário
- **Severidade:** ALTA (Segurança)
- **Arquivo:** `src/components/public/PublicPage.tsx:34-38`
- **Problema:** Campo `bio` é texto simples, não precisa de HTML rendering
- **Ação:**
  1. Substituir `dangerouslySetInnerHTML={{ __html: sanitizedBio }}` por `{page.bio}`
  2. Adicionar `whitespace-pre-wrap` no CSS para preservar quebras de linha
  3. Remover import do DOMPurify (se não usado em outro lugar)

---

## Fase 1 — Crítica (Antes do deploy em produção)

### 1.1 Restringir protocolos aceitos em URLs de links
- **Severidade:** ALTA (Open Redirect)
- **Arquivos:** `src/lib/validators.ts:32`, `src/components/public/PublicLinkItem.tsx:15`
- **Problema:** `z.string().url()` aceita qualquer protocolo, incluindo `javascript:`
- **Ação:**
  1. Adicionar `.refine()` no schema para aceitar apenas `http://` e `https://`
  2. Adicionar constraint CHECK na tabela `links` no banco: `CHECK (url ~ '^https?://')`
  3. Criar migration: `20260215000002_add_url_constraint.sql`

### 1.2 Aumentar requisitos de senha
- **Severidade:** ALTA (Broken Auth)
- **Arquivo:** `src/lib/validators.ts:10`
- **Problema:** Mínimo de 6 caracteres está abaixo do recomendado NIST (8+)
- **Ação:**
  1. Alterar `.min(6)` para `.min(8)`
  2. Adicionar validação de complexidade (maiúscula + número)
  3. Atualizar mensagens de erro em português

### 1.3 Validar `theme` com enum em vez de string aberta
- **Severidade:** ALTA (Input Validation)
- **Arquivos:** `src/lib/validators.ts:26`, `supabase/migrations/`
- **Ação:**
  1. Trocar `z.string().default('light')` por `z.enum(['light', 'dark', 'gradient', 'neon', 'glassmorphism']).default('light')`
  2. Adicionar CHECK constraint no banco
  3. Criar migration: `20260215000003_add_theme_constraint.sql`

### 1.4 Adicionar `user_id` nas queries de update/delete (defense-in-depth)
- **Severidade:** ALTA (IDOR mitigado por RLS)
- **Arquivos:** Todos os services (`landing-page.service.ts`, `link.service.ts`, `storage.service.ts`)
- **Ação:**
  1. Adicionar parâmetro `userId` em `updateLandingPage`, `deleteLandingPage`, `updateLink`, `deleteLink`
  2. Incluir `.eq('user_id', userId)` em todas as queries de escrita
  3. Validar path de avatar com `path.startsWith(userId + '/')`
  4. Atualizar os hooks que chamam esses services

### 1.5 Configurar rate limiting
- **Severidade:** ALTA
- **Arquivos:** `src/services/auth.service.ts`, `src/components/auth/LoginForm.tsx`, `src/components/auth/RegisterForm.tsx`
- **Ação:**
  1. Verificar e configurar rate limits no Supabase Dashboard (Auth > Rate Limits)
  2. Implementar debounce nos formulários de login/registro
  3. Desabilitar botões durante operações async
  4. Adicionar cooldown após falhas de login consecutivas

### 1.6 Corrigir rota `/:username` que captura tudo
- **Severidade:** ALTA (Bug)
- **Arquivo:** `src/router/index.tsx:32`
- **Problema:** `/about`, `/pricing`, `/termos` viram queries inválidas ao Supabase
- **Ação:**
  1. Adicionar validação de formato de username na `PublicLandingPage` antes de fazer query
  2. Verificar contra regex `^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$`
  3. Retornar 404 imediatamente se formato inválido

### 1.7 Criar RPC para eliminar N+1 na rota pública
- **Severidade:** CRÍTICA (Performance)
- **Arquivos:** `src/services/landing-page.service.ts:25-51`, `supabase/migrations/`
- **Ação:**
  1. Criar função RPC `get_public_page(p_username TEXT, p_slug TEXT)` que retorna profile + landing page + links em uma única query
  2. Atualizar `getLandingPageBySlug` para usar a RPC
  3. Remover as 3 queries sequenciais
  4. Criar migration: `20260215000004_add_get_public_page_rpc.sql`

---

## Fase 2 — Alta (Sprint 2)

### 2.1 Resolver race conditions nos hooks async
- **Severidade:** ALTA (Bug)
- **Arquivos:** `src/hooks/useLandingPages.ts`, `src/hooks/useLinks.ts`, `src/hooks/useProfile.ts`, `src/hooks/useFileUpload.ts`
- **Problema:** `setState` após componente desmontar causa memory leaks e warnings
- **Ação:**
  - **Opção A (Recomendada):** Migrar para TanStack Query — resolve automaticamente cancelamento, cache, re-fetch, loading/error states
  - **Opção B (Rápida):** Adicionar `AbortController` ou flag `isMounted` via `useRef` em cada hook
  - Instalar: `npm install @tanstack/react-query`
  - Criar `QueryClientProvider` no `main.tsx`
  - Refatorar cada hook para usar `useQuery` e `useMutation`

### 2.2 Corrigir closure stale no rollback do reorder
- **Severidade:** ALTA (Bug)
- **Arquivo:** `src/hooks/useLinks.ts:52-68`
- **Problema:** Rollback usa valor do closure que pode estar desatualizado
- **Ação:**
  1. Salvar estado anterior via `useRef` antes do optimistic update
  2. Usar o ref no rollback em vez do valor do closure
  3. Alternativamente: refazer fetch completo em caso de erro

### 2.3 Criar RPC transacional para reorder de links
- **Severidade:** ALTA (Performance + Atomicidade)
- **Arquivo:** `src/services/link.service.ts:57-69`
- **Ação:**
  1. Criar função SQL `reorder_links(link_ids UUID[], positions INT[])` com transação
  2. Atualizar o service para chamar a RPC
  3. Elimina N roundtrips e garante atomicidade
  4. Criar migration: `20260215000005_add_reorder_links_rpc.sql`

### 2.4 Corrigir HTML inválido (interactive elements aninhados)
- **Severidade:** ALTA (a11y + Bug)
- **Arquivos:** `src/components/dashboard/PageCard.tsx:49-58`, `src/pages/HomePage.tsx`
- **Problema:** `<Link>` contendo `<Button>` é HTML inválido
- **Ação:**
  1. Substituir `<Link><Button>` por `useNavigate()` com `onClick` no Button
  2. Ou estilizar `<Link>` com classes do Button sem o componente

### 2.5 Expor estado de erro nos hooks
- **Severidade:** MÉDIA (UX)
- **Arquivos:** `src/hooks/useLandingPages.ts`, `src/hooks/useLinks.ts`, `src/hooks/useProfile.ts`
- **Problema:** Erros são engolidos com `console.error`, componentes não exibem erro ao usuário
- **Ação:**
  1. Adicionar `const [error, setError] = useState<string | null>(null)`
  2. Expor `error` no retorno de cada hook
  3. Resetar `error` no início de cada fetch
  4. (Se migrar para TanStack Query na 2.1, isso vem automaticamente)

### 2.6 Adicionar testes com Vitest
- **Severidade:** ALTA (Qualidade)
- **Arquivo:** `package.json`
- **Ação:**
  1. `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
  2. Configurar `vitest.config.ts`
  3. Adicionar script `"test": "vitest"` no package.json
  4. Escrever testes para: `validators.ts`, services, hooks principais

### 2.7 Corrigir `handleSetDefault` — não desmarca página anterior na UI
- **Severidade:** MÉDIA (Bug)
- **Arquivo:** `src/pages/DashboardPage.tsx:38-45`
- **Ação:**
  1. Após `update()`, chamar `refetch()` para sincronizar estado
  2. Ou atualizar localmente: desmarcar anterior + marcar nova

### 2.8 Corrigir `setState` durante render no ProfileSettings
- **Severidade:** MÉDIA (Bug/Anti-pattern)
- **Arquivo:** `src/pages/ProfileSettingsPage.tsx:18-21`
- **Ação:**
  1. Mover a inicialização para `useEffect(() => { if (profile) setFullName(profile.full_name) }, [profile])`

### 2.9 Corrigir extensão de arquivo derivada do nome
- **Severidade:** MÉDIA (Segurança)
- **Arquivo:** `src/services/storage.service.ts:8`
- **Ação:**
  1. Mapear extensão pelo MIME type em vez de `file.name.split('.').pop()`
  2. Criar mapa: `{ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }`

### 2.10 Configurar code splitting no Vite
- **Severidade:** MÉDIA (Performance)
- **Arquivo:** `vite.config.ts`
- **Ação:**
  1. Configurar `build.rollupOptions.output.manualChunks` para separar vendor
  2. Usar `React.lazy()` + `Suspense` para lazy loading de rotas
  3. Separar chunks: react, supabase, dnd-kit, lucide

---

## Fase 3 — Média (Sprint 3)

### 3.1 Adicionar meta tags SEO e Open Graph
- **Arquivos:** `index.html`, `src/pages/PublicLandingPage.tsx`
- **Ação:**
  1. Adicionar meta description, OG tags no `index.html`
  2. Instalar `react-helmet-async` para meta tags dinâmicas nas páginas públicas
  3. Considerar pre-rendering para rotas públicas

### 3.2 Adicionar Cache-Control para assets estáticos
- **Arquivo:** `vercel.json`
- **Ação:** Adicionar regra `Cache-Control: public, max-age=31536000, immutable` para `/assets/`

### 3.3 Hardening de CSP
- **Arquivo:** `vercel.json`
- **Ação:**
  1. Adicionar `upgrade-insecure-requests`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`
  2. Remover `https://www.google.com` de `img-src` se não há integração Google
  3. Adicionar header `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`

### 3.4 Integrar error monitoring (Sentry)
- **Ação:**
  1. `npm install @sentry/react`
  2. Configurar no `main.tsx`
  3. Adicionar `ErrorBoundary` global
  4. Substituir `console.error` por logging condicional

### 3.5 Adicionar confirmação de delete no LinkItem
- **Arquivo:** `src/components/dashboard/LinkItem.tsx:81`
- **Ação:** Adicionar modal de confirmação ou `window.confirm()`

### 3.6 Resetar input file após upload
- **Arquivo:** `src/components/dashboard/AvatarUpload.tsx:43`
- **Ação:** Adicionar `e.target.value = ''` após upload

### 3.7 Corrigir loading ao trocar de landingPageId
- **Arquivo:** `src/hooks/useLinks.ts`
- **Ação:** Adicionar `setLoading(true); setLinks([])` quando `landingPageId` muda

### 3.8 Unsaved changes detection
- **Arquivo:** `src/pages/PageEditorPage.tsx`
- **Ação:** Implementar `useBeforeUnload` do React Router

### 3.9 Corrigir signOut race condition
- **Arquivo:** `src/components/layout/DashboardLayout.tsx:12-18`
- **Ação:** Aguardar confirmação do estado de auth antes de `navigate('/login')`

### 3.10 Melhorar validação de env vars com Zod
- **Arquivo:** `src/config/env.ts`
- **Ação:** Remover `as string`, usar Zod para validar formato das env vars

### 3.11 Self-host Google Fonts
- **Arquivo:** `index.html:7-9`
- **Ação:** Instalar `@fontsource/inter` e remover `<link>` externo

### 3.12 Remover índice redundante `lower(username)`
- **Arquivo:** `supabase/migrations/`
- **Ação:** Criar migration removendo `idx_profiles_username` (redundante com UNIQUE da coluna)

---

## Fase 4 — Backlog (Melhorias)

### 4.1 Acessibilidade (a11y)
- [ ] Adicionar `aria-label` em botões icon-only (`LinkItem.tsx`)
- [ ] Adicionar `aria-label` no input hidden (`AvatarUpload.tsx`)
- [ ] Corrigir hierarquia de headings (`HomePage.tsx`: h1 → h3 pula h2)
- [ ] Adicionar indicador de página ativa na navegação (`DashboardLayout.tsx`)
- [ ] Usar `NavLink` com `aria-current="page"`

### 4.2 Performance
- [ ] Memoizar funções dos hooks com `useCallback`
- [ ] Adicionar `useMemo` no `activeLinks` do `PagePreview.tsx`
- [ ] Memoizar `PagePreview` com `React.memo`
- [ ] Debounce no preview do editor (re-render a cada keystroke)

### 4.3 UX Melhorias
- [ ] Adicionar loading state no botão Salvar (`ProfileSettingsPage.tsx`)
- [ ] Indicador de truncamento na bio preview (`PagePreview.tsx`)
- [ ] Substituir `window.confirm` por modal React (`DashboardPage.tsx`)
- [ ] Feedback de loading no toggle de visibilidade (`LinkItem.tsx`)
- [ ] Cancelamento de upload de arquivo

### 4.4 Database
- [ ] Adicionar constraint `CHECK (position >= 0)` na tabela `links`
- [ ] Clarificar lógica de slug vazio vs `is_default`
- [ ] Adicionar índice composto `(user_id, created_at DESC)` em `landing_pages`

### 4.5 Código
- [ ] Remover `PublicLayout.tsx` se não utilizado (dead code)
- [ ] Unificar lógica de slug (`PageForm.handleSlugChange` vs `utils.slugify`)
- [ ] Mover import inline de tipo no `PageEditorPage.tsx`
- [ ] Verificar email duplicado no `signUp` (`auth.service.ts`)

---

## Checklist de Verificação Pós-Correção

- [ ] `npm run build` compila sem erros
- [ ] `npm run lint` passa sem warnings
- [ ] `npm run test` todos os testes passam
- [ ] Testar login/registro/logout
- [ ] Testar CRUD de landing pages
- [ ] Testar CRUD de links + reorder
- [ ] Testar upload de avatar
- [ ] Testar página pública (`/:username`)
- [ ] Testar em mobile (responsividade)
- [ ] Verificar headers de segurança com securityheaders.com
- [ ] Verificar CSP no console do navegador (sem erros)
- [ ] Verificar performance com Lighthouse
- [ ] Testar com leitor de tela (VoiceOver/NVDA)

---

## Notas

- Cada fase pode ser um PR separado para facilitar review
- As migrations do Supabase devem ser testadas em ambiente de staging antes de produção
- Ao migrar para TanStack Query (Fase 2.1), muitos issues de Fases 2 e 3 serão resolvidos automaticamente
- O `.env.local` NÃO deve ser commitado — já protegido pelo `.gitignore` atualizado
