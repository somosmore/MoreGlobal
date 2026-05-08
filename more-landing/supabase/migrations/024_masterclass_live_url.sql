-- Actualizar la landing de masterclass con la URL de producción
-- Fecha: 2026-05-08

UPDATE landing_projects
SET
  live_url = 'https://moremigracion.com/masterclass',
  updated_at = now()
WHERE route = '/masterclass';
