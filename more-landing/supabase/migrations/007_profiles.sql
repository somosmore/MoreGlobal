-- Tabla de perfiles de usuario con roles (standard / root)
-- Fecha: 2026-03-03

CREATE TABLE IF NOT EXISTS profiles (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'standard'
             CHECK (role IN ('standard', 'root')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente al registrar un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, role)
  VALUES (NEW.id, 'standard')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- El usuario puede leer su propio perfil
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Solo root puede leer todos los perfiles
CREATE POLICY "profiles_select_root"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'root'
    )
  );

-- Solo root puede actualizar roles
CREATE POLICY "profiles_update_root"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'root'
    )
  );

-- Inserción permitida solo por el trigger (SECURITY DEFINER)
CREATE POLICY "profiles_insert_trigger"
  ON profiles FOR INSERT
  WITH CHECK (true);
