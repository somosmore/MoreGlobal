-- Agrega campo de recordatorio de seguimiento a leads
-- Fecha: 2026-03-03

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS followup_at timestamptz DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_leads_followup
  ON public.leads (followup_at)
  WHERE followup_at IS NOT NULL;
