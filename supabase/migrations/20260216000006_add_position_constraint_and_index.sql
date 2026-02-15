-- 4.4.1: Garantir que position nunca seja negativo
ALTER TABLE public.links
  ADD CONSTRAINT links_position_non_negative CHECK (position >= 0);

-- 4.4.3: Índice composto para queries de landing pages por user_id ordenadas por data
CREATE INDEX IF NOT EXISTS idx_landing_pages_user_created
  ON public.landing_pages (user_id, created_at DESC);
