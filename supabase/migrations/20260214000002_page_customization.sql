-- ============================================
-- Personalização de landing pages
-- ============================================

-- Coluna JSONB para armazenar todas as customizações
-- (cores, estilo de botão, fonte, redes sociais)
ALTER TABLE public.landing_pages
  ADD COLUMN IF NOT EXISTS customization JSONB NOT NULL DEFAULT '{}';

-- Tipo do item na lista de links: 'link' (padrão) ou 'header'
ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'link';

ALTER TABLE public.links
  ADD CONSTRAINT chk_link_type CHECK (type IN ('link', 'header'));
