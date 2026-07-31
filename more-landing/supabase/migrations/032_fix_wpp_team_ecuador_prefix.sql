-- Corrige números del equipo importados con prefijo Ecuador (593) por error
-- cuando eran móviles colombianos (empiezan en 3, 10 dígitos nacionales).
-- Ejemplo: https://wa.me/5933132219798 → https://wa.me/573132219798
-- Fecha: 2026-07-30

UPDATE wpp_team_numbers
SET url = regexp_replace(url, '^https://wa\.me/593(3[0-9]{9})$', 'https://wa.me/57\1')
WHERE url ~ '^https://wa\.me/5933[0-9]{9}$';

-- Quita "+" residual en wa.me (WhatsApp solo acepta dígitos en la ruta)
UPDATE wpp_team_numbers
SET url = regexp_replace(url, '^https://wa\.me/\+', 'https://wa.me/')
WHERE url ~ '^https://wa\.me/\+';
