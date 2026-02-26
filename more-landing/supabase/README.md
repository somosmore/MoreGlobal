# Supabase – Testimonios

## Pasos para conectar la landing a Supabase

1. **Crear proyecto** en [supabase.com](https://supabase.com) y anotar URL y anon key.

2. **Variables de entorno** en la raíz de `more-landing`:
   - Copiar `.env.example` a `.env`
   - Rellenar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los valores del proyecto.

3. **Aplicar migración** (tabla y RLS):
   - En el dashboard de Supabase: **SQL Editor** → New query.
   - Pegar y ejecutar el contenido de `migrations/001_testimonials.sql`.

4. **Crear usuario admin** (Auth):
   - En Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
   - Email y contraseña: los que usarás para entrar en `/admin`.
   - Ese usuario (autenticado) podrá crear, editar y eliminar testimonios gracias a las políticas RLS.

5. **Seed opcional** (datos de ejemplo):
   - En **SQL Editor**, ejecutar el contenido de `seed_testimonials.sql`.
   - Solo ejecutar una vez para no duplicar filas.

6. **Storage (opcional)**. Para que el admin pueda subir fotos desde el panel:
   - En **Storage** crear un bucket `testimonial-photos`.
   - Marcar el bucket como **Public** para lectura.
   - En el panel admin, `photo_url` puede ser por ahora una URL externa o la URL pública del archivo subido manualmente en Storage.
