-- Claves de medición (Meta Pixel, GTM, GA4) y interruptor global
-- Fecha: 2026-04-07

INSERT INTO site_settings (key, value) VALUES
  ('meta_pixel_id', ''),
  ('google_tag_manager_id', ''),
  ('ga4_measurement_id', ''),
  ('tracking_enabled', 'true')
ON CONFLICT (key) DO NOTHING
