---
name: security-review
description: Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. Provides comprehensive security checklist and patterns. Also use when the user types /security-review to scan the entire codebase and generate a security report.
---

# Security Review Skill

Este skill analisa o código do projeto e gera um relatório de segurança completo, identificando vulnerabilidades e apontando o que está fora das melhores práticas.

## Quando Ativar

- Implementando autenticação ou autorização
- Lidando com input de usuário ou upload de arquivos
- Criando novos endpoints de API
- Trabalhando com secrets ou credenciais
- Implementando funcionalidades de pagamento
- Armazenando ou transmitindo dados sensíveis
- Integrando APIs de terceiros
- Quando o usuário invocar `/security-review`

## Instruções de Execução

Quando este skill for invocado, execute uma auditoria completa do codebase seguindo TODOS os passos abaixo. O resultado deve ser um **relatório de segurança** organizado por categoria, indicando claramente:

- ✅ O que está correto
- ❌ O que está vulnerável (com arquivo e linha)
- ⚠️ O que precisa de atenção/melhoria
- 💡 Recomendações específicas de correção

### Passo 1: Varredura de Secrets e Credenciais

Busque no codebase por:
- Strings que pareçam API keys, tokens, senhas hardcoded (padrões como `sk-`, `pk_`, `Bearer`, `password`, senhas em strings)
- Arquivos `.env` commitados ou expostos
- Verificar se `.env` e `.env.local` estão no `.gitignore`
- Secrets expostos em código client-side (arquivos em `src/`, `app/`, `pages/`, `components/`)
- Chaves do Supabase: `anon key` pode ser pública, mas `service_role key` NUNCA deve estar no client-side

Comandos de busca sugeridos:
```
Grep: padrões como "sk-", "password", "secret", "token", "apikey", "api_key", "private_key", "service_role"
Grep: "process.env" para mapear uso de variáveis de ambiente
Glob: ".env*" para encontrar arquivos de environment
```

### Passo 2: Validação de Input

Busque por:
- Uso de `z.object` / `zod` / `yup` / `joi` para validação
- Inputs de formulário sem validação
- Dados de requisição usados diretamente sem sanitização
- Upload de arquivos sem validação de tipo/tamanho
- Uso direto de `req.body`, `req.query`, `req.params` sem validação

O que verificar:
```
Grep: "req.body", "req.query", "req.params", "request.json", "formData"
Grep: "z.object", "z.string", "yup.object", "Joi.object" (presença de validação)
Grep: "dangerouslySetInnerHTML" (potencial XSS)
```

### Passo 3: SQL Injection e Queries Inseguras

Busque por:
- Template literals ou concatenação de strings em queries SQL
- Uso de `.rpc()` do Supabase com parâmetros não sanitizados
- Queries raw sem parameterização
- Funções SQL no Supabase sem validação de input

O que verificar:
```
Grep: padrões como "SELECT.*\$\{", "INSERT.*\$\{", "UPDATE.*\$\{", "DELETE.*\$\{"
Grep: ".rpc(", ".sql(", "query(" para encontrar queries customizadas
Grep: "supabase.from(" para verificar uso correto do query builder
```

### Passo 4: Proteção XSS (Cross-Site Scripting)

Busque por:
- `dangerouslySetInnerHTML` sem sanitização com DOMPurify
- `innerHTML` direto
- `eval()`, `new Function()`, `document.write()`
- Renderização de conteúdo do usuário sem escape
- Ausência de Content Security Policy (CSP)

O que verificar:
```
Grep: "dangerouslySetInnerHTML", "innerHTML", "eval(", "new Function", "document.write"
Grep: "DOMPurify" (presença de sanitização)
Grep: "Content-Security-Policy" (presença de CSP)
```

### Passo 5: Autenticação e Autorização

Busque por:
- Tokens em `localStorage` (vulnerável a XSS) vs `httpOnly cookies`
- Verificação de sessão/auth em rotas protegidas
- Row Level Security (RLS) habilitado nas tabelas do Supabase
- Verificação de roles/permissões antes de operações sensíveis
- Uso correto do `supabase.auth.getUser()` (server-side) vs `supabase.auth.getSession()` (client-side)

O que verificar:
```
Grep: "localStorage.setItem", "localStorage.getItem" com tokens
Grep: "getUser(", "getSession(", "auth.uid()"
Grep: "ENABLE ROW LEVEL SECURITY", "CREATE POLICY"
Grep: middleware de autenticação
```

### Passo 6: Proteção CSRF

Busque por:
- Presença de tokens CSRF em formulários e requisições POST/PUT/DELETE
- Cookies com `SameSite=Strict` ou `SameSite=Lax`
- Verificação de `Origin` ou `Referer` headers

### Passo 7: Rate Limiting

Busque por:
- Implementação de rate limiting em endpoints de API
- Proteção contra brute force em login
- Limites em operações custosas (search, upload, etc.)

O que verificar:
```
Grep: "rateLimit", "rate-limit", "throttle", "limiter"
```

### Passo 8: Exposição de Dados Sensíveis

Busque por:
- `console.log` com dados sensíveis (senhas, tokens, dados pessoais)
- Stack traces expostos em respostas de erro para o cliente
- Dados sensíveis em respostas de API sem filtragem
- Informações de debug habilitadas em produção

O que verificar:
```
Grep: "console.log", "console.error" perto de "password", "token", "secret"
Grep: "error.message", "error.stack" em respostas HTTP
Grep: ".select('*')" (retornando todos os campos, pode expor dados sensíveis)
```

### Passo 9: Vulnerabilidades via Chrome DevTools / Client-Side

Busque por:
- Lógica de negócio importante executada APENAS no client-side (sem validação server-side)
- Preços, descontos ou cálculos financeiros feitos no frontend
- Verificações de permissão feitas apenas no frontend
- Dados sensíveis armazenados no estado do React acessíveis via DevTools
- Feature flags ou funcionalidades premium controladas apenas por estado do frontend
- Chamadas de API sem autenticação que podem ser reproduzidas via DevTools/cURL

O que verificar:
```
Grep: "price", "amount", "discount", "total" em componentes React
Grep: "isAdmin", "isPremium", "role", "permission" em estado client-side
Grep: verificar se rotas de API validam auth no server-side
```

### Passo 10: Headers de Segurança e CORS

Busque por:
- Configuração de CORS (`Access-Control-Allow-Origin: *` é perigoso)
- Headers de segurança: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security
- Configuração de HTTPS

O que verificar:
```
Grep: "Access-Control-Allow-Origin", "cors("
Grep: "X-Frame-Options", "X-Content-Type-Options"
Glob: "next.config.*", "vercel.json" para configurações de headers
```

### Passo 11: Dependências

Execute ou sugira:
```bash
npm audit
npm outdated
```

## Formato do Relatório Final

Gere o relatório no seguinte formato:

```
# 🔒 Relatório de Segurança - [Nome do Projeto]
**Data**: [data atual]
**Arquivos analisados**: [quantidade]

## Resumo Executivo
- 🟢 Itens seguros: X
- 🔴 Vulnerabilidades críticas: X
- 🟡 Alertas e melhorias: X

---

## 1. Secrets e Credenciais
[Status: ✅ Seguro | ❌ Vulnerável | ⚠️ Atenção]
[Detalhes e arquivos afetados]

## 2. Validação de Input
[Status e detalhes]

## 3. SQL Injection
[Status e detalhes]

## 4. XSS (Cross-Site Scripting)
[Status e detalhes]

## 5. Autenticação e Autorização
[Status e detalhes]

## 6. CSRF
[Status e detalhes]

## 7. Rate Limiting
[Status e detalhes]

## 8. Exposição de Dados Sensíveis
[Status e detalhes]

## 9. Segurança Client-Side (Chrome DevTools)
[Status e detalhes]

## 10. Headers de Segurança e CORS
[Status e detalhes]

## 11. Dependências
[Status e detalhes]

---

## 🔧 Ações Recomendadas (por prioridade)

### Crítico (corrigir imediatamente)
1. [Ação + arquivo + código sugerido]

### Alto (corrigir antes do deploy)
1. [Ação + arquivo + código sugerido]

### Médio (melhorias recomendadas)
1. [Ação + arquivo + código sugerido]

### Baixo (boas práticas)
1. [Ação + arquivo + código sugerido]
```

## Referência Rápida de Padrões Seguros

### Secrets
```typescript
// ✅ CORRETO
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) throw new Error('OPENAI_API_KEY not configured')

// ❌ ERRADO
const apiKey = "sk-proj-xxxxx"
```

### Validação de Input (Zod)
```typescript
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

export async function createUser(input: unknown) {
  const validated = CreateUserSchema.parse(input)
  return await db.users.create(validated)
}
```

### Upload de Arquivo Seguro
```typescript
function validateFileUpload(file: File) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) throw new Error('File too large (max 5MB)')

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) throw new Error('Invalid file type')

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!ext || !allowedExtensions.includes(ext)) throw new Error('Invalid extension')
}
```

### SQL Injection - Supabase
```typescript
// ✅ CORRETO - Query builder parametrizado
const { data } = await supabase
  .from('users')
  .select('id, name, email')
  .eq('email', userEmail)

// ✅ CORRETO - RPC com parâmetros
const { data } = await supabase.rpc('search_users', { search_term: query })

// ❌ ERRADO - Template literal em SQL
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
```

### XSS Prevention
```typescript
import DOMPurify from 'isomorphic-dompurify'

// ✅ CORRETO
function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}

// ❌ ERRADO
function UnsafeHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

### Autenticação Supabase
```typescript
// ✅ CORRETO - Server-side: sempre usar getUser() (valida com o servidor)
const { data: { user }, error } = await supabase.auth.getUser()

// ⚠️ CUIDADO - Client-side only: getSession() não valida com servidor
const { data: { session } } = await supabase.auth.getSession()

// ✅ CORRETO - Cookies httpOnly
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)

// ❌ ERRADO - localStorage (vulnerável a XSS)
localStorage.setItem('token', token)
```

### Row Level Security (Supabase)
```sql
-- ✅ Habilitar RLS em TODAS as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Usuários veem apenas seus dados
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Usuários atualizam apenas seus dados
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Mais restritivo para login
  message: 'Too many login attempts'
})
```

### Error Handling Seguro
```typescript
// ✅ CORRETO
catch (error) {
  console.error('Internal error:', error) // Log no servidor
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}

// ❌ ERRADO
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}
```

### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co"
    ].join('; ')
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
]
```

### Proteção contra DevTools / Client-Side Manipulation
```typescript
// ✅ CORRETO - Validar preço no SERVER, não confiar no client
export async function POST(req: Request) {
  const { productId, quantity } = await req.json()

  // Buscar preço do BANCO DE DADOS, nunca do frontend
  const product = await db.products.findUnique({ where: { id: productId } })
  const total = product.price * quantity

  return processPayment(total)
}

// ❌ ERRADO - Confiar no preço enviado pelo frontend
export async function POST(req: Request) {
  const { price, quantity } = await req.json() // Atacante pode alterar via DevTools
  return processPayment(price * quantity)
}
```

## Pre-Deployment Security Checklist

Antes de QUALQUER deploy para produção:

- [ ] **Secrets**: Nenhum secret hardcoded, todos em env vars
- [ ] **Input Validation**: Todos os inputs validados com schemas
- [ ] **SQL Injection**: Todas as queries parametrizadas
- [ ] **XSS**: Conteúdo de usuário sanitizado
- [ ] **CSRF**: Proteção habilitada
- [ ] **Autenticação**: Tokens em httpOnly cookies
- [ ] **Autorização**: Verificação de roles implementada
- [ ] **Rate Limiting**: Habilitado em todos os endpoints
- [ ] **HTTPS**: Forçado em produção
- [ ] **Security Headers**: CSP, X-Frame-Options configurados
- [ ] **Error Handling**: Sem dados sensíveis em erros
- [ ] **Logging**: Sem dados sensíveis em logs
- [ ] **Dependências**: Atualizadas, sem vulnerabilidades
- [ ] **Row Level Security**: Habilitado no Supabase
- [ ] **CORS**: Configurado corretamente (não usar *)
- [ ] **File Uploads**: Validados (tamanho, tipo)
- [ ] **Client-Side**: Lógica crítica validada no server-side
