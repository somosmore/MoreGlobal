-- Normaliza el teléfono de contacto de MORE: el único número válido es +57 302 241 9122.
-- Fecha: 2026-11-12

UPDATE site_settings SET value = '+573022419122', updated_at = now() WHERE key = 'whatsapp_number';
UPDATE site_settings SET value = '+57 302 241 9122', updated_at = now() WHERE key = 'contact_phone';

-- Rotador /wppequipo: un solo número activo.
UPDATE wpp_team_numbers SET url = 'https://wa.me/573022419122', updated_at = now()
WHERE url = 'https://wa.me/573132219798';

-- wa.link/a1z0jm apunta a un número que ya no es válido: se desactiva (no se borra).
UPDATE wpp_team_numbers SET is_active = false, updated_at = now()
WHERE url = 'https://wa.link/a1z0jm';
