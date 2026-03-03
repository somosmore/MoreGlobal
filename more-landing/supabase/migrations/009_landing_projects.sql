-- Tabla de proyectos de landing generados por el wizard
-- Fecha: 2026-03-03

CREATE TABLE IF NOT EXISTS landing_projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID REFERENCES clients(id) ON DELETE SET NULL,
  created_by       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name             TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'complete', 'generated')),
  answers          JSONB NOT NULL DEFAULT '{}',
  tech_config      JSONB NOT NULL DEFAULT '{}',
  generated_json   JSONB,
  generated_prompt TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_landing_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_landing_projects_updated_at
  BEFORE UPDATE ON landing_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_projects_updated_at();

-- Habilitar RLS
ALTER TABLE landing_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "landing_projects_select_authenticated"
  ON landing_projects FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "landing_projects_insert_authenticated"
  ON landing_projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "landing_projects_update_authenticated"
  ON landing_projects FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "landing_projects_delete_authenticated"
  ON landing_projects FOR DELETE
  USING (auth.role() = 'authenticated');
