-- RPC para carregar pagina publica em uma unica query (elimina N+1)
-- Retorna: profile + landing_page + links ativos ordenados por position

CREATE OR REPLACE FUNCTION public.get_public_page(p_username TEXT, p_slug TEXT DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_profile JSONB;
  v_page JSONB;
  v_links JSONB;
  v_profile_id UUID;
  v_page_id UUID;
BEGIN
  -- 1. Buscar profile
  SELECT jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'full_name', p.full_name,
    'avatar_url', p.avatar_url
  ), p.id
  INTO v_profile, v_profile_id
  FROM public.profiles p
  WHERE p.username = p_username;

  IF v_profile IS NULL THEN
    RETURN NULL;
  END IF;

  -- 2. Buscar landing page (por slug ou default)
  IF p_slug IS NOT NULL AND p_slug <> '' THEN
    SELECT jsonb_build_object(
      'id', lp.id,
      'user_id', lp.user_id,
      'slug', lp.slug,
      'title', lp.title,
      'bio', lp.bio,
      'theme', lp.theme,
      'avatar_url', lp.avatar_url,
      'is_default', lp.is_default,
      'customization', lp.customization,
      'created_at', lp.created_at,
      'updated_at', lp.updated_at
    ), lp.id
    INTO v_page, v_page_id
    FROM public.landing_pages lp
    WHERE lp.user_id = v_profile_id AND lp.slug = p_slug;
  ELSE
    SELECT jsonb_build_object(
      'id', lp.id,
      'user_id', lp.user_id,
      'slug', lp.slug,
      'title', lp.title,
      'bio', lp.bio,
      'theme', lp.theme,
      'avatar_url', lp.avatar_url,
      'is_default', lp.is_default,
      'customization', lp.customization,
      'created_at', lp.created_at,
      'updated_at', lp.updated_at
    ), lp.id
    INTO v_page, v_page_id
    FROM public.landing_pages lp
    WHERE lp.user_id = v_profile_id AND lp.is_default = true;
  END IF;

  IF v_page IS NULL THEN
    RETURN NULL;
  END IF;

  -- 3. Buscar links ativos
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', l.id,
      'landing_page_id', l.landing_page_id,
      'user_id', l.user_id,
      'title', l.title,
      'url', l.url,
      'icon_url', l.icon_url,
      'position', l.position,
      'is_active', l.is_active,
      'type', l.type,
      'created_at', l.created_at,
      'updated_at', l.updated_at
    ) ORDER BY l.position ASC
  ), '[]'::jsonb)
  INTO v_links
  FROM public.links l
  WHERE l.landing_page_id = v_page_id;

  -- 4. Retornar tudo junto
  RETURN jsonb_build_object(
    'profile', v_profile,
    'page', v_page,
    'links', v_links
  );
END;
$$;
