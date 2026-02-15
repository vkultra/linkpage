-- Fix handle_new_user trigger:
-- 1. Add SET search_path to prevent search_path hijacking
-- 2. Add COALESCE for username (handles social login / magic link where username is NULL)
-- 3. Add BEGIN...EXCEPTION for constraint error handling

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'user-' || LEFT(NEW.id::text, 8)
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Username collision: append random suffix
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (
      NEW.id,
      'user-' || LEFT(NEW.id::text, 8) || '-' || FLOOR(RANDOM() * 1000)::text,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
