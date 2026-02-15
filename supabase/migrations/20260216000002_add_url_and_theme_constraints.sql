-- 1.1: Restrict URL protocols to http/https only
ALTER TABLE public.links
  ADD CONSTRAINT links_url_protocol_check
  CHECK (url = '' OR url ~ '^https?://');

-- 1.3: Restrict theme to valid enum values
ALTER TABLE public.landing_pages
  ADD CONSTRAINT landing_pages_theme_check
  CHECK (theme IN ('light', 'dark', 'gradient', 'neon', 'glassmorphism'));
