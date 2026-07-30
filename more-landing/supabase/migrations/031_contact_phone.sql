-- Teléfono de display del footer (distinto de whatsapp_number para wa.me)
-- Fecha: 2026-07-30

INSERT INTO site_settings (key, value)
VALUES ('contact_phone', '+1 (548) 312-2105')
ON CONFLICT (key) DO NOTHING;
