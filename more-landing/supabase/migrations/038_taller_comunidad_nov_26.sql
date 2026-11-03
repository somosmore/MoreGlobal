-- Taller Comunidad More "Diseña tu ruta migratoria" — /taller-nov-26
-- Fecha: 2026-11-02
-- Evento PAGO y virtual: lunes 23 de noviembre 2026, 19:00 Colombia.
-- Leads: masterclass_leads (source = 'taller-comunidad-nov-26') + GHL tag 'Taller-Comunidad-Nov-26'
-- (+ 'Taller-Comunidad-Nov-26-General' / '-VIP' según la entrada elegida).

-- 1) Entrada elegida en eventos pagos (nullable: las landings gratuitas no la usan).
ALTER TABLE masterclass_leads
  ADD COLUMN IF NOT EXISTS ticket_type text
  CHECK (ticket_type IS NULL OR ticket_type IN ('general', 'vip'));

-- 2) Landing registrada pero INACTIVA hasta cargar precios y links de pago.
--    Activar desde Admin → Recursos → disponibilidad de landings (o is_active = true).
INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route) VALUES (
  'Taller Comunidad More: Diseña tu ruta migratoria (23 nov 2026)', 'generated',
  '{"type": "workshop", "topic": "taller-comunidad", "paid": true}',
  '{"framework": "react", "built_in": true}', false, '/taller-nov-26')
ON CONFLICT DO NOTHING;

-- 3) Fechas del evento (editables en Admin → Settings → Taller Comunidad).
INSERT INTO site_settings (key, value) VALUES
  ('tc_event_date', '2026-11-23T19:00:00-05:00'),
  ('tc_registration_closes_at', '2026-11-23T19:00:00-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4) Precios y links de pago: vacíos hasta definirlos; no pisan valores ya cargados.
INSERT INTO site_settings (key, value) VALUES
  ('tc_general_price', ''),
  ('tc_general_payment_link', ''),
  ('tc_vip_price', ''),
  ('tc_vip_payment_link', '')
ON CONFLICT (key) DO NOTHING;
