-- Actualiza fechas del Taller Cambio de Estatus (/taller-niw)
-- Evento: jueves 6 de agosto 2026, 19:00 Colombia
-- Fecha: 2026-08-01

INSERT INTO site_settings (key, value) VALUES
  ('tn_event_date', '2026-08-06T19:00:00-05:00'),
  ('tn_registration_closes_at', '2026-08-07T23:59:59-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
