import type { LeadStatus } from "@/lib/supabase"

export const RESULT_LABELS: Record<string, string> = {
  alto_impacto: "Alto Impacto",
  unsung: "Unsung",
}

export const ACADEMIC_LABELS: Record<string, string> = {
  maestria: "Maestría",
  doctorado: "Doctorado / PhD",
  grado5: "Grado + 5 años",
  otros: "En proceso / Otra formación",
}

export const AREA_LABELS: Record<string, string> = {
  salud: "Salud & Medicina",
  stem: "STEM & Tecnología",
  social: "Impacto Social",
  negocios: "Negocios & Emprendimiento",
}

export const ACHIEVEMENT_LABELS: Record<string, string> = {
  premios: "Premios",
  publicaciones: "Publicaciones",
  liderazgo: "Liderazgo",
  patentes: "Patentes",
  conferencias: "Conferencias",
}

export const SEGMENT_LABELS: Record<string, string> = {
  listo: "Listo para aplicar",
  necesita_estructura: "Necesita estructuración",
  no_califica_aun: "No califica aún",
}

export const ROUTE_LABELS: Record<string, string> = {
  unsung_program: "Programa Unsung",
  mentoria_more: "Mentoría / Academia MORE",
  abogado: "Referido a abogado",
  contenido: "Contenido educativo",
}

export const VISA_BUCKET_LABELS: Record<string, string> = {
  eb1: "EB1",
  eb2: "EB2 / NIW",
  o1: "O1",
  e2: "E2",
  l1: "L1",
  otra: "Otra ruta",
}

export const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string; dot: string }[] = [
  { value: "nuevo",       label: "Nuevo",       color: "bg-blue-500/15 text-blue-400 border-blue-400/25",    dot: "bg-blue-400" },
  { value: "contactado",  label: "Contactado",  color: "bg-amber-500/15 text-amber-400 border-amber-400/25", dot: "bg-amber-400" },
  { value: "en_consulta", label: "En consulta", color: "bg-orange/15 text-orange border-orange/30",          dot: "bg-orange" },
  { value: "calificado",  label: "Calificado",  color: "bg-emerald-500/15 text-emerald-400 border-emerald-400/25", dot: "bg-emerald-400" },
  { value: "cerrado",     label: "Cerrado",     color: "bg-admin-subtle text-admin-faint border-admin-border",     dot: "bg-admin-faint" },
  { value: "perdido",     label: "Perdido",     color: "bg-red-500/15 text-red-400 border-red-400/25",         dot: "bg-red-400" },
]

export function statusMeta(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0]
}
