-- RPC transacional para reordenar links
-- Substitui N updates individuais por uma unica chamada atomica

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
  -- Validar que os arrays tem o mesmo tamanho
  IF array_length(p_link_ids, 1) IS DISTINCT FROM array_length(p_positions, 1) THEN
    RAISE EXCEPTION 'link_ids and positions arrays must have the same length';
  END IF;

  -- Atualizar posicoes em uma unica transacao
  FOR i IN 1..array_length(p_link_ids, 1) LOOP
    UPDATE links
    SET position = p_positions[i]
    WHERE id = p_link_ids[i]
      AND user_id = p_user_id;
  END LOOP;
END;
$$;
