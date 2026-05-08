-- Permite lectura pública mínima de landing_projects para el runtime check de activación
-- Solo expone is_active, activate_at, deactivate_at por ruta (columnas de disponibilidad)
-- No abre INSERT / UPDATE / DELETE al rol anon
-- Fecha: 2026-05-08

CREATE POLICY "landing_projects_select_public"
  ON landing_projects FOR SELECT
  TO anon
  USING (route IS NOT NULL);
