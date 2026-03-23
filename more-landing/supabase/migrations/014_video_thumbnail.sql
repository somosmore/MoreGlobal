-- Agrega soporte de foto de portada para testimonios de video
-- Fecha: 2026-03-18

ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS video_thumbnail_url text;

-- Bucket público para thumbnails de video
INSERT INTO storage.buckets (id, name, public)
  VALUES ('video-thumbnails', 'video-thumbnails', true)
  ON CONFLICT (id) DO NOTHING;

-- Lectura pública
CREATE POLICY "Public read video-thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'video-thumbnails');

-- Upload solo usuarios autenticados
CREATE POLICY "Auth upload video-thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'video-thumbnails');

-- Delete solo usuarios autenticados
CREATE POLICY "Auth delete video-thumbnails"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'video-thumbnails');
