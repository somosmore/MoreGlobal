-- Agrega campo live_url a landing_projects para vincular el sitio desplegado
-- Fecha: 2026-03-04

ALTER TABLE landing_projects
  ADD COLUMN IF NOT EXISTS live_url TEXT;
