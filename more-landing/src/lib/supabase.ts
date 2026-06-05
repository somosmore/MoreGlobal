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
  video_thumbnail_url: string | null;
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
  country_residence: string | null;
  nationality: string | null;
  in_us_status: string | null;
  migration_goal: string | null;
  academic_level: string;
  impact_area: string;
  achievements: string[];
  result_type: "alto_impacto" | "unsung";
  treaty_visa_eligible: boolean | null;
  business_experience: string | null;
  investment_capacity: string | null;
  company_can_expand: string | null;
  extraordinary_profile: string | null;
  high_level_connections: string[] | null;
  project_clarity: string | null;
  evidence_readiness: string | null;
  timeframe: string | null;
  eligibility_segment: string | null;
  recommended_route: string | null;
  visa_buckets: string[];
  status: LeadStatus;
  followup_at: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type LeadInsert = Omit<Lead, "id" | "created_at" | "status" | "followup_at" | "deleted_at"> & {
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

export type WppTeamNumber = {
  id: string
  label: string
  url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type SiteSettingsMap = {
  calendar_url: string
  whatsapp_number: string
  contact_email: string
  instagram_url: string
  linkedin_url: string
  facebook_url: string
  youtube_url: string
  vip_payment_link: string
  vip_price: string
  meta_pixel_id: string
  google_tag_manager_id: string
  ga4_measurement_id: string
  tracking_enabled: string
  upp_payment_link: string
  upp_price: string
  upp_countdown_date: string
  turbo_payment_link: string
  turbo_price: string
  turbo_countdown_date: string
  wppequipo_enabled: string
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
  live_url: string | null;
  is_active: boolean;
  activate_at: string | null;
  deactivate_at: string | null;
  route: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client | null;
};

export type LandingProjectInsert = Omit<
  LandingProject,
  "id" | "created_at" | "updated_at" | "clients" | "live_url" | "is_active" | "activate_at" | "deactivate_at" | "route"
> & {
  id?: string;
  live_url?: string | null;
  is_active?: boolean;
  activate_at?: string | null;
  deactivate_at?: string | null;
  route?: string | null;
};

export type LandingProjectUpdate = Partial<
  Omit<LandingProject, "id" | "created_at" | "clients">
>;

// ─── Resources ────────────────────────────────────────────────────────────────

export type ResourceType = "brand" | "strategy" | "playbook" | "landing";
export type ResourceFormat = "pdf" | "html" | "link";

export type Resource = {
  id: string;
  title: string;
  description: string | null;
  type: ResourceType;
  format: ResourceFormat;
  url: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type ResourceInsert = Omit<Resource, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type ResourceUpdate = Partial<ResourceInsert>;
