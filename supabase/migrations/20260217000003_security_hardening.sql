-- =====================================================
-- 5.8: Explicit deny policies for analytics tables
-- (Operations already denied by RLS default, this makes intent explicit)
-- =====================================================

-- page_views: block direct INSERT/UPDATE/DELETE (only via service_role)
CREATE POLICY "Block direct inserts" ON public.page_views FOR INSERT WITH CHECK (false);
CREATE POLICY "Block direct updates" ON public.page_views FOR UPDATE USING (false);
CREATE POLICY "Block direct deletes" ON public.page_views FOR DELETE USING (false);

-- link_clicks: block direct INSERT/UPDATE/DELETE (only via service_role)
CREATE POLICY "Block direct inserts" ON public.link_clicks FOR INSERT WITH CHECK (false);
CREATE POLICY "Block direct updates" ON public.link_clicks FOR UPDATE USING (false);
CREATE POLICY "Block direct deletes" ON public.link_clicks FOR DELETE USING (false);


-- =====================================================
-- 5.10: Cross-landing-page validation in reorder_links
-- =====================================================

CREATE OR REPLACE FUNCTION reorder_links(
  p_link_ids UUID[],
  p_positions INT[],
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i INT;
BEGIN
  -- Validate arrays have same length
  IF array_length(p_link_ids, 1) IS DISTINCT FROM array_length(p_positions, 1) THEN
    RAISE EXCEPTION 'link_ids and positions arrays must have the same length';
  END IF;

  -- Validate all links belong to the same landing page
  IF (SELECT COUNT(DISTINCT landing_page_id) FROM links
      WHERE id = ANY(p_link_ids) AND user_id = p_user_id) > 1 THEN
    RAISE EXCEPTION 'All links must belong to the same landing page';
  END IF;

  -- Update positions in a single transaction
  FOR i IN 1..array_length(p_link_ids, 1) LOOP
    UPDATE links
    SET position = p_positions[i]
    WHERE id = p_link_ids[i]
      AND user_id = p_user_id;
  END LOOP;
END;
$$;


-- =====================================================
-- 5.12: Index on facebook_pixels.user_id for RLS performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_facebook_pixels_user_id ON public.facebook_pixels (user_id);
