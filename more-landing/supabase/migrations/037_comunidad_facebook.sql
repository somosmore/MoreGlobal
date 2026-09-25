-- Landing "Comunidad MORE" (captación → grupo de Facebook) — /comunidad
-- Fecha: 2026-09-25
-- Sin fechas en site_settings: la comunidad no es un evento, no tiene countdown ni cierre.
-- Los leads llegan a masterclass_leads con source = 'comunidad-facebook' y tag GHL 'Comunidad-Facebook'.

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route) VALUES (
  'Comunidad MORE: grupo de Facebook', 'generated',
  '{"type": "community", "topic": "comunidad-facebook"}',
  '{"framework": "react", "built_in": true}', true, '/comunidad')
ON CONFLICT DO NOTHING;
