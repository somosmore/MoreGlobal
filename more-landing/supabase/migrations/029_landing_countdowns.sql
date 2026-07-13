-- Fechas de las landings de campaña, hasta ahora hardcodeadas en el código.
-- Se siembran con los valores actuales para no cambiar el comportamiento al desplegar.
-- Editables desde Admin → Settings → Landings de campaña.
-- Fecha: 2026-07-13

INSERT INTO site_settings (key, value) VALUES
  ('mc_event_date', '2026-05-25T19:00:00-05:00'),
  ('mc_registration_closes_at', '2026-05-27T23:59:59-05:00'),
  ('tn_event_date', '2026-07-13T19:00:00-05:00'),
  ('tn_registration_closes_at', '2026-07-15T23:59:59-05:00')
ON CONFLICT (key) DO NOTHING
