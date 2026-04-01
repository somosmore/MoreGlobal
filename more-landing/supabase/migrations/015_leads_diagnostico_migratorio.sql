-- Extiende la tabla leads con campos para el diagnóstico migratorio completo
-- Fecha: 2026-04-01

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS country_residence text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS in_us_status text,
  ADD COLUMN IF NOT EXISTS migration_goal text,
  ADD COLUMN IF NOT EXISTS treaty_visa_eligible boolean,
  ADD COLUMN IF NOT EXISTS business_experience text,
  ADD COLUMN IF NOT EXISTS investment_capacity text,
  ADD COLUMN IF NOT EXISTS company_can_expand text,
  ADD COLUMN IF NOT EXISTS extraordinary_profile text,
  ADD COLUMN IF NOT EXISTS high_level_connections text[],
  ADD COLUMN IF NOT EXISTS project_clarity text,
  ADD COLUMN IF NOT EXISTS evidence_readiness text,
  ADD COLUMN IF NOT EXISTS timeframe text,
  ADD COLUMN IF NOT EXISTS eligibility_segment text,
  ADD COLUMN IF NOT EXISTS recommended_route text,
  ADD COLUMN IF NOT EXISTS visa_buckets text[] DEFAULT '{}'::text[];

