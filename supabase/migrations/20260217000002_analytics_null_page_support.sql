-- =====================================================
-- Allow NULL p_landing_page_id = aggregate all user pages
-- =====================================================

-- Summary (KPI cards)
CREATE OR REPLACE FUNCTION get_analytics_summary(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE result JSONB;
BEGIN
  -- Ownership check only for a specific page
  IF p_landing_page_id IS NOT NULL AND NOT EXISTS (
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
      WHERE (p_landing_page_id IS NULL OR landing_page_id = p_landing_page_id)
        AND user_id = auth.uid()
        AND clicked_at BETWEEN p_start AND p_end
    ),
    'unique_clickers', (
      SELECT COUNT(DISTINCT ip_hash) FROM public.link_clicks
      WHERE (p_landing_page_id IS NULL OR landing_page_id = p_landing_page_id)
        AND user_id = auth.uid()
        AND clicked_at BETWEEN p_start AND p_end
    )
  ) INTO result
  FROM public.page_views
  WHERE (p_landing_page_id IS NULL OR landing_page_id = p_landing_page_id)
    AND user_id = auth.uid()
    AND viewed_at BETWEEN p_start AND p_end;

  RETURN result;
END;
$$;


-- Views by day (line chart)
CREATE OR REPLACE FUNCTION get_views_by_day(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(day DATE, views BIGINT, unique_views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF p_landing_page_id IS NOT NULL AND NOT EXISTS (
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
  WHERE (p_landing_page_id IS NULL OR pv.landing_page_id = p_landing_page_id)
    AND pv.user_id = auth.uid()
    AND pv.viewed_at BETWEEN p_start AND p_end
  GROUP BY 1
  ORDER BY 1;
END;
$$;


-- Top links clicked (bar chart)
CREATE OR REPLACE FUNCTION get_top_links(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(link_id UUID, title TEXT, clicks BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF p_landing_page_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.landing_pages
    WHERE id = p_landing_page_id AND user_id = auth.uid()
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT c.link_id, l.title, COUNT(*)::bigint AS clicks
  FROM public.link_clicks c
  JOIN public.links l ON l.id = c.link_id
  WHERE (p_landing_page_id IS NULL OR c.landing_page_id = p_landing_page_id)
    AND c.user_id = auth.uid()
    AND c.clicked_at BETWEEN p_start AND p_end
  GROUP BY c.link_id, l.title
  ORDER BY clicks DESC
  LIMIT 10;
END;
$$;


-- Hourly distribution (bar chart)
CREATE OR REPLACE FUNCTION get_hourly_distribution(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(hour INT, views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF p_landing_page_id IS NOT NULL AND NOT EXISTS (
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
  WHERE (p_landing_page_id IS NULL OR pv.landing_page_id = p_landing_page_id)
    AND pv.user_id = auth.uid()
    AND pv.viewed_at BETWEEN p_start AND p_end
  GROUP BY 1
  ORDER BY 1;
END;
$$;


-- Geo distribution by state (map)
CREATE OR REPLACE FUNCTION get_geo_distribution(
  p_landing_page_id UUID,
  p_start TIMESTAMPTZ,
  p_end TIMESTAMPTZ
) RETURNS TABLE(region TEXT, views BIGINT, unique_views BIGINT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF p_landing_page_id IS NOT NULL AND NOT EXISTS (
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
  WHERE (p_landing_page_id IS NULL OR pv.landing_page_id = p_landing_page_id)
    AND pv.user_id = auth.uid()
    AND pv.viewed_at BETWEEN p_start AND p_end
    AND pv.country = 'Brazil'
    AND pv.region IS NOT NULL
  GROUP BY pv.region
  ORDER BY views DESC;
END;
$$;
