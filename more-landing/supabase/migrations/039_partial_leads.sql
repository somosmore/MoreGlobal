-- Captura de leads parciales (abandono de formulario) para remarketing.
-- Fecha: 2026-11-03
-- El formulario guarda el email apenas es válido y luego suma teléfono/país;
-- al enviar, marca completed = true. Lista de remarketing: completed = false.

CREATE TABLE IF NOT EXISTS partial_leads (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   uuid NOT NULL UNIQUE,
  source       text NOT NULL,
  email        text NOT NULL,
  nombre       text,
  phone        text,
  pais         text,
  ticket_type  text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_content  text,
  utm_term     text,
  completed    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partial_leads_source_completed_idx
  ON partial_leads (source, completed, created_at DESC);

-- Sin políticas para anon: nadie lee ni escribe la tabla directo desde el sitio.
ALTER TABLE partial_leads ENABLE ROW LEVEL SECURITY;

-- Lectura solo para usuarios autenticados (panel admin).
DROP POLICY IF EXISTS "partial_leads_admin_select" ON partial_leads;
CREATE POLICY "partial_leads_admin_select" ON partial_leads
  FOR SELECT TO authenticated USING (true);

-- Única vía de escritura pública: upsert por sesión, con validación.
-- Nunca pisa un dato ya guardado con uno vacío, y "completed" solo pasa a true.
CREATE OR REPLACE FUNCTION public.capture_partial_lead(
  p_session_id   uuid,
  p_source       text,
  p_email        text,
  p_nombre       text DEFAULT NULL,
  p_phone        text DEFAULT NULL,
  p_pais         text DEFAULT NULL,
  p_ticket_type  text DEFAULT NULL,
  p_utm_source   text DEFAULT NULL,
  p_utm_medium   text DEFAULT NULL,
  p_utm_campaign text DEFAULT NULL,
  p_utm_content  text DEFAULT NULL,
  p_utm_term     text DEFAULT NULL,
  p_completed    boolean DEFAULT false
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(coalesce(p_email, '')));
BEGIN
  IF p_session_id IS NULL OR coalesce(trim(p_source), '') = '' THEN
    RETURN;
  END IF;
  IF length(v_email) > 254 OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RETURN;
  END IF;

  INSERT INTO partial_leads (
    session_id, source, email, nombre, phone, pais, ticket_type,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term, completed
  ) VALUES (
    p_session_id,
    left(trim(p_source), 80),
    v_email,
    nullif(left(trim(coalesce(p_nombre, '')), 160), ''),
    nullif(left(regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g'), 20), ''),
    nullif(left(trim(coalesce(p_pais, '')), 60), ''),
    CASE WHEN p_ticket_type IN ('general', 'vip') THEN p_ticket_type END,
    nullif(left(coalesce(p_utm_source, ''), 120), ''),
    nullif(left(coalesce(p_utm_medium, ''), 120), ''),
    nullif(left(coalesce(p_utm_campaign, ''), 160), ''),
    nullif(left(coalesce(p_utm_content, ''), 160), ''),
    nullif(left(coalesce(p_utm_term, ''), 160), ''),
    coalesce(p_completed, false)
  )
  ON CONFLICT (session_id) DO UPDATE SET
    email        = EXCLUDED.email,
    nombre       = coalesce(EXCLUDED.nombre, partial_leads.nombre),
    phone        = coalesce(EXCLUDED.phone, partial_leads.phone),
    pais         = coalesce(EXCLUDED.pais, partial_leads.pais),
    ticket_type  = coalesce(EXCLUDED.ticket_type, partial_leads.ticket_type),
    utm_source   = coalesce(partial_leads.utm_source, EXCLUDED.utm_source),
    utm_medium   = coalesce(partial_leads.utm_medium, EXCLUDED.utm_medium),
    utm_campaign = coalesce(partial_leads.utm_campaign, EXCLUDED.utm_campaign),
    utm_content  = coalesce(partial_leads.utm_content, EXCLUDED.utm_content),
    utm_term     = coalesce(partial_leads.utm_term, EXCLUDED.utm_term),
    completed    = partial_leads.completed OR EXCLUDED.completed,
    updated_at   = now();
END;
$$;

REVOKE ALL ON FUNCTION public.capture_partial_lead(
  uuid, text, text, text, text, text, text, text, text, text, text, text, boolean
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.capture_partial_lead(
  uuid, text, text, text, text, text, text, text, text, text, text, text, boolean
) TO anon, authenticated;
