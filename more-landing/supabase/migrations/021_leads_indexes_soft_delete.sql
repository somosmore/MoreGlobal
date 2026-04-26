-- Índices para columnas filtradas en AdminLeads + soft delete
-- Fecha: 2026-04-26

-- ─── Índices faltantes ───────────────────────────────────────────────────────
-- AdminLeads filtra por status, result_type, eligibility_segment, country_residence
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_result_type ON public.leads (result_type);
CREATE INDEX IF NOT EXISTS idx_leads_eligibility_segment ON public.leads (eligibility_segment);

-- ─── Soft delete ─────────────────────────────────────────────────────────────
-- Agregar columna deleted_at (null = activo, timestamp = borrado)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

-- Índice parcial: solo filas activas (optimiza queries del admin que excluyen borrados)
CREATE INDEX IF NOT EXISTS idx_leads_active ON public.leads (created_at DESC) WHERE deleted_at IS NULL;

-- Actualizar RLS: SELECT solo muestra leads no borrados
-- (root puede ver borrados usando una query explícita si necesita)
DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
CREATE POLICY "leads_select_admin"
  ON public.leads FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()) AND deleted_at IS NULL);

-- Reemplazar DELETE por UPDATE de deleted_at (soft delete)
-- Los admins standard pueden soft-delete, root puede hard-delete
DROP POLICY IF EXISTS "leads_delete_root" ON public.leads;
CREATE POLICY "leads_delete_root"
  ON public.leads FOR DELETE
  TO authenticated
  USING (public.profile_user_is_root(auth.uid()));
