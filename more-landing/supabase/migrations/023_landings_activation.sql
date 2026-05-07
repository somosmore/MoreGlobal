-- Columnas de activación/desactivación y ruta para landing_projects
-- Fecha: 2026-05-07

ALTER TABLE landing_projects
  ADD COLUMN IF NOT EXISTS is_active      BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS activate_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deactivate_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS route          TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_landing_projects_route
  ON landing_projects (route) WHERE route IS NOT NULL;

-- Registrar la masterclass como landing activa
INSERT INTO landing_projects (
  name, status, answers, tech_config, is_active, route
) VALUES (
  'Masterclass: El Paso Cero para migrar a EE.UU.',
  'generated',
  '{"type": "masterclass", "topic": "EB2-NIW"}',
  '{"framework": "react", "built_in": true}',
  true,
  '/masterclass'
)
ON CONFLICT DO NOTHING;
