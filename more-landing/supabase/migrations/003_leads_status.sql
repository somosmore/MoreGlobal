-- Agregar columna status al pipeline CRM de leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'nuevo'
  CHECK (status IN ('nuevo', 'contactado', 'en_consulta', 'calificado', 'cerrado', 'perdido'));

-- Índice para filtrar/ordenar por estado en el panel admin
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
