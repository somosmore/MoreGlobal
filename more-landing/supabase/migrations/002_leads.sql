-- Tabla leads: captura de prospectos desde el quiz EB-2 NIW
CREATE TABLE IF NOT EXISTS public.leads (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          text        NOT NULL,
  email           text        NOT NULL,
  whatsapp        text,
  academic_level  text        NOT NULL,
  impact_area     text        NOT NULL,
  achievements    text[]      NOT NULL DEFAULT '{}',
  result_type     text        NOT NULL CHECK (result_type IN ('alto_impacto', 'unsung')),
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Índice para ordenar por fecha (listado en admin)
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);

-- RLS: INSERT público (quiz sin login), SELECT/DELETE solo admins autenticados
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
CREATE POLICY "leads_insert_public"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
CREATE POLICY "leads_select_admin"
  ON public.leads FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "leads_update_admin" ON public.leads;
CREATE POLICY "leads_update_admin"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "leads_delete_admin" ON public.leads;
CREATE POLICY "leads_delete_admin"
  ON public.leads FOR DELETE
  TO authenticated
  USING (true);
