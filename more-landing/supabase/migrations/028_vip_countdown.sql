-- Ventana de oferta de la Asesoría VIP: fecha de cierre del contador.
-- Vacío = la página queda siempre disponible.
-- Al pasar la fecha, /asesoria-vip muestra el aviso de oferta cerrada con CTA a WhatsApp.
-- Fecha: 2026-07-13

INSERT INTO site_settings (key, value) VALUES
  ('vip_countdown_date', '')
ON CONFLICT (key) DO NOTHING
