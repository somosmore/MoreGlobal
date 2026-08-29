-- Masterclass 1 del Instituto More: "El nuevo panorama migratorio de EE.UU." — /webinar-sep-26
-- Fecha: 2026-08-29

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, route) VALUES (
  'Masterclass 1: El nuevo panorama migratorio de EE.UU.', 'generated',
  '{"type": "webinar", "topic": "panorama-migratorio"}',
  '{"framework": "react", "built_in": true}', true, '/webinar-sep-26')
ON CONFLICT DO NOTHING;

INSERT INTO site_settings (key, value) VALUES
  ('ws_event_date', '2026-09-03T19:00:00-05:00'),
  ('ws_registration_closes_at', '2026-09-04T23:59:59-05:00')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
