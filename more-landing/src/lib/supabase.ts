import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Testimonial = {
  id: string;
  name: string;
  country: string | null;
  role: string | null;
  area: string | null;
  program: string | null;
  quote: string;
  timeline: string | null;
  status_label: string | null;
  media_type: "text_photo" | "video";
  photo_url: string | null;
  video_url: string | null;
  category:
    | "abogados_in_house"
    | "abogados_preparadora_monica_martinez"
    | "aprobados_abogada_marcela_rodriguez"
    | "en_espera_aprobacion";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TestimonialInsert = Omit<
  Testimonial,
  "id" | "created_at" | "updated_at"
> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type TestimonialUpdate = Partial<TestimonialInsert>;

export type LeadStatus =
  | "nuevo"
  | "contactado"
  | "en_consulta"
  | "calificado"
  | "cerrado"
  | "perdido";

export type Lead = {
  id: string;
  nombre: string;
  email: string;
  whatsapp: string | null;
  academic_level: string;
  impact_area: string;
  achievements: string[];
  result_type: "alto_impacto" | "unsung";
  status: LeadStatus;
  followup_at: string | null;
  created_at: string;
};

export type LeadInsert = Omit<Lead, "id" | "created_at" | "status" | "followup_at"> & {
  status?: LeadStatus;
  followup_at?: string | null;
};

export type LeadNote = {
  id: string;
  lead_id: string;
  content: string;
  author: string;
  created_at: string;
};

export type LeadNoteInsert = Omit<LeadNote, "id" | "created_at">;

export const CATEGORY_LABELS: Record<Testimonial["category"], string> = {
  abogados_in_house: "Aprobados In House",
  abogados_preparadora_monica_martinez:
    "Aprobados para preparadora Mónica Martínez",
  aprobados_abogada_marcela_rodriguez:
    "Aprobados para abogada Marcela Rodríguez",
  en_espera_aprobacion: "En espera de aprobación",
};
