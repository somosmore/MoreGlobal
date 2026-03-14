-- Agrega las URLs de redes sociales como configuraciones del sitio
-- Fecha: 2026-03-14

INSERT INTO site_settings (key, value)
VALUES
  ('instagram_url', 'https://instagram.com/somos.more'),
  ('linkedin_url', ''),
  ('facebook_url', '')
ON CONFLICT (key) DO NOTHING;
