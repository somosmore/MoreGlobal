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

export type SiteSetting = {
  key: string
  value: string | null
  updated_at: string
}

export type SiteSettingsMap = {
  calendar_url: string
  whatsapp_number: string
  contact_email: string
}

export const CATEGORY_LABELS: Record<Testimonial["category"], string> = {
  abogados_in_house: "Aprobados In House",
  abogados_preparadora_monica_martinez:
    "Aprobados para preparadora Mónica Martínez",
  aprobados_abogada_marcela_rodriguez:
    "Aprobados para abogada Marcela Rodríguez",
  en_espera_aprobacion: "En espera de aprobación",
};

// ─── Roles ────────────────────────────────────────────────────────────────────

export type UserRole = "standard" | "root";

export type Profile = {
  user_id: string;
  role: UserRole;
  created_at: string;
};

// ─── Clients ──────────────────────────────────────────────────────────────────

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type ClientUpdate = Partial<ClientInsert>;

// ─── Landing Projects ─────────────────────────────────────────────────────────

export type ProjectStatus = "draft" | "complete" | "generated";

export type WizardAnswers = {
  part1?: {
    brand_name?: string | null;
    one_liner?: string | null;
    industry?: string | null;
    brand_colors?: string | null;
  };
  part2?: {
    client_pain?: string | null;
    happy_ending?: string | null;
    differentiator?: string | null;
  };
  part3?: {
    ideal_client?: string | null;
    client_segments?: string | null;
  };
  part4?: {
    services?: string | null;
    primary_action?: string | null;
    primary_action_url?: string | null;
    impressive_number?: string | null;
  };
  part5?: {
    testimonials?: string | null;
    guarantee?: string | null;
  };
};

export type TechConfig = {
  stack?: string | null;
  database?: string | null;
  needs_admin?: boolean | null;
  domain?: string | null;
  tracking?: string | null;
  notes?: string | null;
};

export type GeneratedLandingJson = {
  hero?: {
    badge?: string;
    h1?: string;
    h2?: string;
    cta_primary?: string;
    cta_secondary?: string;
    trust_line?: string;
    urgency_line?: string;
  };
  pain_points?: Array<{ title: string; description: string }>;
  who_we_help?: Array<{ segment: string; description: string; result: string }>;
  pricing?: Array<{
    name: string;
    description: string;
    features: string[];
    cta: string;
  }>;
  testimonials?: Array<{
    name: string;
    role: string;
    text: string;
    metric?: string;
  }>;
  faq?: Array<{ question: string; answer: string }>;
  trust_stats?: string[];
  risk_reversal?: string;
};

export type LandingProject = {
  id: string;
  client_id: string | null;
  created_by: string | null;
  name: string;
  status: ProjectStatus;
  answers: WizardAnswers;
  tech_config: TechConfig;
  generated_json: GeneratedLandingJson | null;
  generated_prompt: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client | null;
};

export type LandingProjectInsert = Omit<
  LandingProject,
  "id" | "created_at" | "updated_at" | "clients"
> & {
  id?: string;
};

export type LandingProjectUpdate = Partial<
  Omit<LandingProject, "id" | "created_at" | "clients">
>;
