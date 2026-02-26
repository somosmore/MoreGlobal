-- Tabla testimonials (casos de éxito)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  role text,
  area text,
  program text,
  quote text NOT NULL,
  timeline text,
  status_label text,
  media_type text NOT NULL DEFAULT 'text_photo' CHECK (media_type IN ('text_photo', 'video')),
  photo_url text,
  video_url text,
  category text NOT NULL CHECK (category IN (
    'abogados_in_house',
    'abogados_preparadora_monica_martinez',
    'aprobados_abogada_marcela_rodriguez',
    'en_espera_aprobacion'
  )),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Índices para listado por categoría y orden
CREATE INDEX IF NOT EXISTS idx_testimonials_category ON public.testimonials (category);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials (category, sort_order, id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS testimonials_updated_at ON public.testimonials;
CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- RLS: lectura pública, escritura solo autenticados
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "testimonials_select_public" ON public.testimonials;
CREATE POLICY "testimonials_select_public"
  ON public.testimonials FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "testimonials_insert_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_insert_authenticated"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "testimonials_update_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_update_authenticated"
  ON public.testimonials FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "testimonials_delete_authenticated" ON public.testimonials;
CREATE POLICY "testimonials_delete_authenticated"
  ON public.testimonials FOR DELETE
  USING (auth.role() = 'authenticated');

-- Storage bucket para fotos (ejecutar en Dashboard o con Supabase CLI si aplica)
-- Crear bucket 'testimonial-photos' público para lectura.
