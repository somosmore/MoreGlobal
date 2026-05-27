-- Números de WhatsApp del equipo para /wppequipo + flag de activación
-- Fecha: 2026-05-27

CREATE TABLE IF NOT EXISTS wpp_team_numbers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_wpp_team_numbers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_wpp_team_numbers_updated_at ON wpp_team_numbers;

CREATE TRIGGER trg_wpp_team_numbers_updated_at
  BEFORE UPDATE ON wpp_team_numbers
  FOR EACH ROW
  EXECUTE FUNCTION update_wpp_team_numbers_updated_at();

ALTER TABLE wpp_team_numbers ENABLE ROW LEVEL SECURITY;

-- Visitantes: solo números activos (página pública)
CREATE POLICY "wpp_team_numbers_select_active_public"
  ON wpp_team_numbers FOR SELECT
  USING (is_active = true);

-- Admins autenticados: ven todos los registros
CREATE POLICY "wpp_team_numbers_select_authenticated"
  ON wpp_team_numbers FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "wpp_team_numbers_insert_authenticated"
  ON wpp_team_numbers FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "wpp_team_numbers_update_authenticated"
  ON wpp_team_numbers FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "wpp_team_numbers_delete_authenticated"
  ON wpp_team_numbers FOR DELETE
  USING (auth.role() = 'authenticated');

-- Flag global de activación de la página
INSERT INTO site_settings (key, value) VALUES
  ('wppequipo_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Seed con los enlaces actuales
INSERT INTO wpp_team_numbers (label, url, is_active, sort_order) VALUES
  ('Equipo MORE 1', 'https://wa.me/message/VRDWDC4SHZIOA1', true, 0),
  ('Equipo MORE 2', 'https://wa.link/a1z0jm', true, 1);
