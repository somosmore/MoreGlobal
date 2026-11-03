-- Taller Comunidad More: versión con precio exclusivo de la comunidad — /taller-23nov/comunidad
-- Fecha: 2026-11-03
-- Comunidad: General $50 USD · VIP $97 USD (público: $67 / $127).

-- 1) Versión de precio con la que se registró el lead (nullable: las demás landings no la usan).
ALTER TABLE masterclass_leads
  ADD COLUMN IF NOT EXISTS price_tier text
  CHECK (price_tier IS NULL OR price_tier IN ('publico', 'comunidad'));

-- 2) Precios de comunidad (se pisan si ya existían) y links de pago (no se pisan).
INSERT INTO site_settings (key, value) VALUES
  ('tc_comunidad_general_price', '$50 USD'),
  ('tc_comunidad_vip_price', '$97 USD')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES
  ('tc_comunidad_general_payment_link', ''),
  ('tc_comunidad_vip_payment_link', '')
ON CONFLICT (key) DO NOTHING;
