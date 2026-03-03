-- Tabla de configuración global del sitio
-- Fecha: 2026-03-03

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Habilitar RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Lectura pública (visitantes del sitio pueden leer la config)
CREATE POLICY "site_settings_select_public"
  ON site_settings FOR SELECT
  USING (true);

-- Escritura solo para usuarios autenticados (admins)
CREATE POLICY "site_settings_insert_authenticated"
  ON site_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "site_settings_update_authenticated"
  ON site_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "site_settings_delete_authenticated"
  ON site_settings FOR DELETE
  USING (auth.role() = 'authenticated');

-- Valores por defecto
INSERT INTO site_settings (key, value) VALUES
  ('calendar_url',   ''),
  ('whatsapp_number', '+18329416026'),
  ('contact_email',  'info@justmore.net')
ON CONFLICT (key) DO NOTHING;
