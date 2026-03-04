-- Permite INSERT en leads también para usuarios authenticated
-- Fecha: 2026-03-04
--
-- El INSERT público original solo cubría el rol `anon`.
-- Cuando un usuario autenticado (ej. admin) completa el quiz,
-- la petición llega con rol `authenticated` y RLS la bloqueaba (error 42501).

DROP POLICY IF EXISTS "leads_insert_authenticated" ON public.leads;
CREATE POLICY "leads_insert_authenticated"
  ON public.leads FOR INSERT
  TO authenticated
  WITH CHECK (true);
