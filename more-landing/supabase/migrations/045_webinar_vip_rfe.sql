-- Webinar "Del RFE a la visa: qué hacer en cada etapa de tu EB-2 NIW" — /webinar-vip-rfe
-- Comunidad More, entradas General ($50) y VIP ($97) con los links de pago de comunidad.
-- Miércoles 25/11/2026, 8:00 PM Colombia (se ajusta en Admin → Configuración → Webinar VIP).
-- Fecha: 2026-11-24

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route)
SELECT 'Webinar VIP: Del RFE a la visa', 'generated',
       '{"type": "webinar", "topic": "rfe-aprobacion-espera", "audience": "comunidad"}',
       '{"framework": "react", "built_in": true}', true, '/webinar-vip-rfe'
WHERE NOT EXISTS (SELECT 1 FROM landing_projects WHERE route = '/webinar-vip-rfe');

-- Precios y links: los de la entrada de comunidad del taller (tc_comunidad_*), copiados para que el
-- webinar se pueda cambiar después sin tocar el taller.
INSERT INTO site_settings (key, value) VALUES
  ('wv_event_date', '2026-11-25T20:00:00-05:00'),
  ('wv_registration_closes_at', '2026-11-25T20:30:00-05:00'),
  ('wv_general_price', '$50 USD'),
  ('wv_general_payment_link', coalesce((SELECT value FROM site_settings WHERE key = 'tc_comunidad_general_payment_link'), '')),
  ('wv_vip_price', '$97 USD'),
  ('wv_vip_payment_link', coalesce((SELECT value FROM site_settings WHERE key = 'tc_comunidad_vip_payment_link'), ''))
ON CONFLICT (key) DO NOTHING;
