-- Admin "Inscritos al taller": estado de cobro por inscrito.
-- Fecha: 2026-11-03
-- Requiere 038 (ticket_type) y 041 (price_tier).

ALTER TABLE masterclass_leads
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid')),
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_note text,
  ADD COLUMN IF NOT EXISTS is_test boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS masterclass_leads_source_created_idx
  ON masterclass_leads (source, created_at DESC);

-- El admin (authenticated) puede actualizar SOLO los campos de cobro y la entrada;
-- nunca nombre, email, teléfono ni UTMs. Las filas siguen protegidas por RLS.
REVOKE UPDATE ON masterclass_leads FROM authenticated;
GRANT UPDATE (payment_status, paid_at, payment_note, is_test, ticket_type, price_tier)
  ON masterclass_leads TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can update masterclass leads payment" ON masterclass_leads;
CREATE POLICY "Authenticated users can update masterclass leads payment" ON masterclass_leads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
