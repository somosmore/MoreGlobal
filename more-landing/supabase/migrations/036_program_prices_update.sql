-- Actualización de precios: UPE (upp_price) $3,500 · Plan Turbo (turbo_price) $10,000
-- Fecha: 2026-09-02

INSERT INTO site_settings (key, value) VALUES
  ('upp_price', '$3,500'),
  ('turbo_price', '$10,000')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
