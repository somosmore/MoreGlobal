-- Taller "Red flags de los abogados de inmigración" — /taller-niw
-- Fecha: 2026-06-23
--
-- 1. Agrega columna `profesion` a masterclass_leads (reutilizada por todos los
--    eventos/webinars). Backward-compatible: nullable, no rompe inserts previos.
-- 2. Registra la landing del taller en landing_projects para que useLandingStatus
--    la deje accesible (is_active = true).

ALTER TABLE masterclass_leads
  ADD COLUMN IF NOT EXISTS profesion text;

INSERT INTO landing_projects (
  name, status, answers, tech_config, is_active, route
) VALUES (
  'Taller: Red flags de los abogados de inmigración',
  'generated',
  '{"type": "webinar", "topic": "red-flags-abogados"}',
  '{"framework": "react", "built_in": true}',
  true,
  '/taller-niw'
)
ON CONFLICT DO NOTHING;
