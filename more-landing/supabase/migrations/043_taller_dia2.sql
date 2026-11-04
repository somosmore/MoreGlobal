-- Taller Comunidad More: segundo día (martes 24 nov 2026, 19:00 Colombia) "Destraba tu proceso".
-- Fecha: 2026-11-03
-- Entradas: general = Día 1 · dia2 = Día 2 (nueva) · vip = Pase completo VIP (Día 1 + Día 2).

-- 1) Nueva entrada en masterclass_leads.ticket_type.
ALTER TABLE masterclass_leads DROP CONSTRAINT IF EXISTS masterclass_leads_ticket_type_check;
ALTER TABLE masterclass_leads
  ADD CONSTRAINT masterclass_leads_ticket_type_check
  CHECK (ticket_type IS NULL OR ticket_type IN ('general', 'dia2', 'vip'));

-- 2) Fecha del Día 2 y cierre de inscripción al inicio del Día 2.
INSERT INTO site_settings (key, value) VALUES
  ('tc_event2_date', '2026-11-24T19:00:00-05:00'),
  ('tc_registration_closes_at', '2026-11-24T19:00:00-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3) Precios del Día 2 (supuesto inicial = precio del Día 1; editables en Admin) y links vacíos.
INSERT INTO site_settings (key, value) VALUES
  ('tc_dia2_price', '$67 USD'),
  ('tc_comunidad_dia2_price', '$50 USD'),
  ('tc_dia2_payment_link', ''),
  ('tc_comunidad_dia2_payment_link', '')
ON CONFLICT (key) DO NOTHING;
