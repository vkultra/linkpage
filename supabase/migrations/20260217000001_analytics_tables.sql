-- =====================================================
-- Analytics tables: page_views + link_clicks
-- =====================================================

CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  region TEXT,
  city TEXT
);

CREATE INDEX idx_page_views_page_date ON public.page_views (landing_page_id, viewed_at DESC);
CREATE INDEX idx_page_views_region ON public.page_views (landing_page_id, country, region);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read own page views"
  ON public.page_views FOR SELECT
  USING (user_id = auth.uid());


CREATE TABLE public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT
);

CREATE INDEX idx_link_clicks_page_date ON public.link_clicks (landing_page_id, clicked_at DESC);
CREATE INDEX idx_link_clicks_link ON public.link_clicks (link_id, clicked_at DESC);

ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read own link clicks"
  ON public.link_clicks FOR SELECT
  USING (user_id = auth.uid());


-- =====================================================
-- RPC: Analytics summary (KPI cards)
-- =====================================================
CREATE OR REPLACE FUNCTION get_analytics_summary(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE result JSONB;
BEGIN
  -- Validate ownership
  IF NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN NULL;
  END IF;

  SELECT jsonb_build_object(
    'total_views', COUNT(*),
    'unique_visitors', COUNT(DISTINCT ip_hash),
    'total_clicks', (
      SELECT COUNT(*) FROM public.link_clicks
      WHERE landing_page_id = p_landing_page_id
        AND clicked_at BETWEEN p_start AND p_end
    ),
    'unique_clickers', (
      SELECT COUNT(DISTINCT ip_hash) FROM public.link_clicks
      WHERE landing_page_id = p_landing_page_id
        AND clicked_at BETWEEN p_start AND p_end
    )
  ) INTO result
  FROM public.page_views
  WHERE landing_page_id = p_landing_page_id
    AND viewed_at BETWEEN p_start AND p_end;

  RETURN result;
END;
$$;


-- =====================================================
-- RPC: Views by day (line chart)
-- =====================================================
CREATE OR REPLACE FUNCTION get_views_by_day(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(day DATE, views BIGINT, unique_views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    (pv.viewed_at AT TIME ZONE 'America/Sao_Paulo')::date AS day,
    COUNT(*)::bigint AS views,
    COUNT(DISTINCT pv.ip_hash)::bigint AS unique_views
  FROM public.page_views pv
  WHERE pv.landing_page_id = p_landing_page_id
    AND pv.viewed_at BETWEEN p_start AND p_end
  GROUP BY 1
  ORDER BY 1;
END;
$$;


-- =====================================================
-- RPC: Top links clicked (bar chart)
-- =====================================================
CREATE OR REPLACE FUNCTION get_top_links(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(link_id UUID, title TEXT, clicks BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT c.link_id, l.title, COUNT(*)::bigint AS clicks
  FROM public.link_clicks c
  JOIN public.links l ON l.id = c.link_id
  WHERE c.landing_page_id = p_landing_page_id
    AND c.clicked_at BETWEEN p_start AND p_end
  GROUP BY c.link_id, l.title
  ORDER BY clicks DESC
  LIMIT 10;
END;
$$;


-- =====================================================
-- RPC: Hourly distribution (bar chart)
-- =====================================================
CREATE OR REPLACE FUNCTION get_hourly_distribution(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(hour INT, views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    EXTRACT(HOUR FROM pv.viewed_at AT TIME ZONE 'America/Sao_Paulo')::int AS hour,
    COUNT(*)::bigint AS views
  FROM public.page_views pv
  WHERE pv.landing_page_id = p_landing_page_id
    AND pv.viewed_at BETWEEN p_start AND p_end
  GROUP BY 1
  ORDER BY 1;
END;
$$;


-- =====================================================
-- RPC: Geo distribution by state (map)
-- =====================================================
CREATE OR REPLACE FUNCTION get_geo_distribution(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(region TEXT, views BIGINT, unique_views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    pv.region,
    COUNT(*)::bigint AS views,
    COUNT(DISTINCT pv.ip_hash)::bigint AS unique_views
  FROM public.page_views pv
  WHERE pv.landing_page_id = p_landing_page_id
    AND pv.viewed_at BETWEEN p_start AND p_end
    AND pv.country = 'Brazil'
    AND pv.region IS NOT NULL
  GROUP BY pv.region
  ORDER BY views DESC;
END;
$$;
