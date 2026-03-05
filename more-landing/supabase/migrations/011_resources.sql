-- Tabla de recursos centralizados (manual de marca, blueprint, playbooks)
-- Fecha: 2026-03-04

CREATE TABLE IF NOT EXISTS resources (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  type         TEXT NOT NULL DEFAULT 'strategy'
               CHECK (type IN ('brand', 'strategy', 'playbook', 'landing')),
  format       TEXT NOT NULL DEFAULT 'link'
               CHECK (format IN ('pdf', 'html', 'link')),
  url          TEXT NOT NULL,
  is_pinned    BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_resources_updated_at ON resources;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'resources_select_authenticated') THEN
    CREATE POLICY "resources_select_authenticated" ON resources FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'resources_insert_authenticated') THEN
    CREATE POLICY "resources_insert_authenticated" ON resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'resources_update_authenticated') THEN
    CREATE POLICY "resources_update_authenticated" ON resources FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resources' AND policyname = 'resources_delete_authenticated') THEN
    CREATE POLICY "resources_delete_authenticated" ON resources FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Seed: recursos iniciales
INSERT INTO resources (title, description, type, format, url, is_pinned) VALUES
(
  'Manual de Marca MORE',
  'Guía completa de identidad visual: paleta de colores, tipografías, usos del logo y tono de comunicación.',
  'brand',
  'pdf',
  '/resources/manual-de-marca.pdf',
  true
),
(
  'Blueprint EB2-NIW 2026',
  'Documento estratégico completo con el plan de negocio, segmentación y hoja de ruta para el proceso EB2-NIW.',
  'strategy',
  'html',
  '/blueprint',
  true
);
