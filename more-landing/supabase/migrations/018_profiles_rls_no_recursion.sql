-- Corrige error 42P17: infinite recursion detected in policy for relation "profiles"
-- Las políticas que hacen EXISTS (SELECT ... FROM profiles) re-evalúan RLS sobre profiles.
-- Fecha: 2026-04-07

CREATE OR REPLACE FUNCTION public.profile_user_is_root(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = uid AND profiles.role = 'root'
  );
$$;

REVOKE ALL ON FUNCTION public.profile_user_is_root(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.profile_user_is_root(uuid) TO authenticated;

DROP POLICY IF EXISTS "profiles_select_root" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_root" ON public.profiles;

CREATE POLICY "profiles_select_root"
  ON public.profiles FOR SELECT
  USING (public.profile_user_is_root(auth.uid()));

CREATE POLICY "profiles_update_root"
  ON public.profiles FOR UPDATE
  USING (public.profile_user_is_root(auth.uid()));
