-- Taller Comunidad More: nueva URL /taller-23nov (la anterior /taller-nov-26 se leía como "26 de noviembre").
-- Fecha: 2026-11-03 — YA APLICADA en producción (pqextffbzzwadrlzgnvb).
-- Se agrega una fila nueva copiando la existente, para no romper la página publicada
-- durante el deploy. El frontend redirige /taller-nov-26 → /taller-23nov (con UTMs).
-- Los identificadores internos (source 'taller-comunidad-nov-26', tag GHL 'Taller-Comunidad-Nov-26')
-- no cambian, para no partir los datos.

INSERT INTO landing_projects (name, status, answers, tech_config, is_active, activate_at, deactivate_at, route)
SELECT name, status, answers, tech_config, is_active, activate_at, deactivate_at, '/taller-23nov'
FROM landing_projects
WHERE route = '/taller-nov-26'
  AND NOT EXISTS (SELECT 1 FROM landing_projects WHERE route = '/taller-23nov');

-- Opcional, cuando el deploy con la redirección esté en producción:
-- UPDATE landing_projects SET is_active = false WHERE route = '/taller-nov-26';
