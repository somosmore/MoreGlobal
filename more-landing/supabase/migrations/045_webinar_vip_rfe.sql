-- Webinar VIP "Del RFE a la visa: qué hacer en cada etapa de tu EB-2 NIW" — /webinar-vip-rfe
-- Solo miembros VIP, entrada paga ($50 USD). Fecha provisoria: miércoles 25/11/2026 7:00 PM Colombia
-- (se ajusta en Admin → Configuración → Webinar VIP). El link de pago se carga ahí mismo.
-- Fecha: 2026-11-24

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route)
SELECT 'Webinar VIP: Del RFE a la visa', 'generated',
       '{"type": "webinar", "topic": "rfe-aprobacion-espera", "audience": "vip"}',
       '{"framework": "react", "built_in": true}', true, '/webinar-vip-rfe'
WHERE NOT EXISTS (SELECT 1 FROM landing_projects WHERE route = '/webinar-vip-rfe');

INSERT INTO site_settings (key, value) VALUES
  ('wv_event_date', '2026-11-25T19:00:00-05:00'),
  ('wv_registration_closes_at', '2026-11-25T19:30:00-05:00'),
  ('wv_price', '$50 USD'),
  ('wv_payment_link', '')
ON CONFLICT (key) DO NOTHING;
