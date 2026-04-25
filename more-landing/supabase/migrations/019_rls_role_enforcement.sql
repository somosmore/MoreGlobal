-- Endurece políticas RLS: verifica rol real en lugar de solo auth.role() = 'authenticated'
-- Fecha: 2026-04-25
--
-- Problema: cualquier usuario autenticado (incluso si se registra vía API directa)
-- podía SELECT, UPDATE y DELETE todos los leads, testimonials, settings, etc.
-- La verificación de rol (standard/root) solo existía en el frontend.
--
-- Fix: usa funciones SECURITY DEFINER que verifican el rol en la tabla profiles.
-- - is_admin(): rol standard o root (lectura y escritura normal)
-- - profile_user_is_root(): solo root (operaciones destructivas y settings)
--
-- IMPORTANTE: después de ejecutar esta migración, verificar en Supabase Dashboard
-- que la auto-registración (Auth → Settings → Enable Sign Up) esté DESHABILITADA
-- si no querés que cualquiera pueda crear una cuenta admin.

-- ─── Helper function: is_admin ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = uid
    AND profiles.role IN ('standard', 'root')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- ─── LEADS ───────────────────────────────────────────────────────────────────
-- INSERT público (quiz) se mantiene.
-- SELECT y UPDATE: solo admins verificados.
-- DELETE: solo root.

DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
CREATE POLICY "leads_select_admin"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "leads_update_admin" ON public.leads;
CREATE POLICY "leads_update_admin"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "leads_delete_admin" ON public.leads;
CREATE POLICY "leads_delete_root"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

-- ─── LEAD NOTES ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Autenticados pueden leer notas" ON public.lead_notes;
CREATE POLICY "lead_notes_select_admin"
  ON public.lead_notes FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Autenticados pueden insertar notas" ON public.lead_notes;
CREATE POLICY "lead_notes_insert_admin"
  ON public.lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Autenticados pueden eliminar sus notas" ON public.lead_notes;
CREATE POLICY "lead_notes_delete_admin"
  ON public.lead_notes FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ─── TESTIMONIALS ────────────────────────────────────────────────────────────
-- SELECT público se mantiene (se muestran en la landing).

DROP POLICY IF EXISTS "testimonials_insert_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_insert_admin"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "testimonials_update_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_update_admin"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "testimonials_delete_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_delete_root"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

-- ─── SITE SETTINGS ──────────────────────────────────────────────────────────
-- SELECT público se mantiene (la landing necesita leer WhatsApp, tracking IDs, etc.).
-- Todas las escrituras: solo root.

DROP POLICY IF EXISTS "site_settings_insert_authenticated" ON site_settings;
CREATE POLICY "site_settings_insert_root"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.profile_user_is_root(auth.uid()));

DROP POLICY IF EXISTS "site_settings_update_authenticated" ON site_settings;
CREATE POLICY "site_settings_update_root"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

DROP POLICY IF EXISTS "site_settings_delete_authenticated" ON site_settings;
CREATE POLICY "site_settings_delete_root"
  ON site_settings FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

-- ─── RESOURCES ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "resources_select_authenticated" ON resources;
CREATE POLICY "resources_select_admin"
  ON resources FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "resources_insert_authenticated" ON resources;
CREATE POLICY "resources_insert_admin"
  ON resources FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "resources_update_authenticated" ON resources;
CREATE POLICY "resources_update_admin"
  ON resources FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "resources_delete_authenticated" ON resources;
CREATE POLICY "resources_delete_root"
  ON resources FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

-- ─── CLIENTS ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "clients_select_authenticated" ON clients;
CREATE POLICY "clients_select_admin"
  ON clients FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "clients_insert_authenticated" ON clients;
CREATE POLICY "clients_insert_admin"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "clients_update_authenticated" ON clients;
CREATE POLICY "clients_update_admin"
  ON clients FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "clients_delete_authenticated" ON clients;
CREATE POLICY "clients_delete_root"
  ON clients FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));

-- ─── LANDING PROJECTS ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "landing_projects_select_authenticated" ON landing_projects;
CREATE POLICY "landing_projects_select_admin"
  ON landing_projects FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "landing_projects_insert_authenticated" ON landing_projects;
CREATE POLICY "landing_projects_insert_admin"
  ON landing_projects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "landing_projects_update_authenticated" ON landing_projects;
CREATE POLICY "landing_projects_update_admin"
  ON landing_projects FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "landing_projects_delete_authenticated" ON landing_projects;
CREATE POLICY "landing_projects_delete_root"
  ON landing_projects FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));
