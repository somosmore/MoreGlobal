-- Actualiza fechas del Taller Profesional Global (/taller-niw)
-- Evento: jueves 30 de julio 2026, 19:00 Colombia
-- Fecha: 2026-07-24

INSERT INTO site_settings (key, value) VALUES
  ('tn_event_date', '2026-07-30T19:00:00-05:00'),
  ('tn_registration_closes_at', '2026-07-31T23:59:59-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
