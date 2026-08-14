-- Webinar "¿Cuál es tu estatus, de verdad?" — /webinar-estatus
-- Evento: jueves 20 de junio 2026, 19:00 Colombia
-- Fecha: 2026-08-14

INSERT INTO landing_projects (
  name, status, answers, tech_config, is_active, route
) VALUES (
  'Webinar: ¿Cuál es tu estatus, de verdad?',
  'generated',
  '{"type": "webinar", "topic": "estatus-migratorio"}',
  '{"framework": "react", "built_in": true}',
  true,
  '/webinar-estatus'
)
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('we_event_date', '2026-06-20T19:00:00-05:00'),
  ('we_registration_closes_at', '2026-06-21T23:59:59-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
