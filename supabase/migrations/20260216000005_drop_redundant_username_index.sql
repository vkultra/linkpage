-- Remover indice redundante: lower(username) eh desnecessario porque
-- o CHECK constraint ja forca lowercase e a coluna tem UNIQUE
DROP INDEX IF EXISTS public.idx_profiles_username;
