-- Tabla de clientes/contactos vinculados a proyectos de landing
-- Fecha: 2026-03-03

CREATE TABLE IF NOT EXISTS clients (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT,
  phone      TEXT,
  company    TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_clients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_clients_updated_at();

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados pueden leer clientes
CREATE POLICY "clients_select_authenticated"
  ON clients FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "clients_insert_authenticated"
  ON clients FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "clients_update_authenticated"
  ON clients FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "clients_delete_authenticated"
  ON clients FOR DELETE
  USING (auth.role() = 'authenticated');
