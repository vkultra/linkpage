-- Create update_updated_at function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Facebook Pixels table (separate from landing_pages for security)
CREATE TABLE public.facebook_pixels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pixel_id        TEXT NOT NULL,
  access_token    TEXT NOT NULL,
  test_event_code TEXT,
  events          TEXT[] NOT NULL DEFAULT '{PageView}',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_one_pixel_per_page UNIQUE (landing_page_id)
);

-- RLS: only owner can access (no public SELECT - edge function uses service_role)
ALTER TABLE public.facebook_pixels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pixels"
  ON public.facebook_pixels FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pixels"
  ON public.facebook_pixels FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pixels"
  ON public.facebook_pixels FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pixels"
  ON public.facebook_pixels FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER facebook_pixels_updated_at
  BEFORE UPDATE ON public.facebook_pixels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
