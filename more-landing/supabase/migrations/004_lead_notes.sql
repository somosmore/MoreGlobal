-- Tabla de notas por lead (historial de actividad / seguimiento)
-- Fecha: 2026-03-03

CREATE TABLE IF NOT EXISTS public.lead_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id    uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content    text NOT NULL,
  author     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice para consultas por lead
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id
  ON public.lead_notes (lead_id, created_at DESC);

-- RLS
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Autenticados pueden leer notas"
  ON public.lead_notes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Autenticados pueden insertar notas"
  ON public.lead_notes FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Autenticados pueden eliminar sus notas"
  ON public.lead_notes FOR DELETE
  TO authenticated USING (true);
