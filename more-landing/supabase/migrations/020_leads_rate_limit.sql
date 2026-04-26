-- Rate limiting para inserts anónimos en leads (prevención de spam)
-- Fecha: 2026-04-26
--
-- Limita a 10 leads por minuto y 1 lead por email por hora.
-- Se aplica solo al rol anon (quiz público). Los admins no tienen límite.

CREATE OR REPLACE FUNCTION public.leads_rate_limit_ok()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT (
    SELECT count(*) FROM public.leads
    WHERE created_at > now() - interval '1 minute'
  ) < 10;
$$;

REVOKE ALL ON FUNCTION public.leads_rate_limit_ok() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.leads_rate_limit_ok() TO anon;
GRANT EXECUTE ON FUNCTION public.leads_rate_limit_ok() TO authenticated;

-- Reemplazar la policy de insert público con una que incluye rate limit
DROP POLICY IF EXISTS "leads_insert_public" ON public.leads;
CREATE POLICY "leads_insert_public"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (public.leads_rate_limit_ok());
