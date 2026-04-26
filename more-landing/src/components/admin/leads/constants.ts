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
  { value: "nuevo",       label: "Nuevo",       color: "bg-blue-50 text-blue-700 border-blue-200",    dot: "bg-blue-500" },
  { value: "contactado",  label: "Contactado",  color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  { value: "en_consulta", label: "En consulta", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  { value: "calificado",  label: "Calificado",  color: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
  { value: "cerrado",     label: "Cerrado",     color: "bg-gray-100 text-gray-500 border-gray-200",     dot: "bg-gray-400" },
  { value: "perdido",     label: "Perdido",     color: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-500" },
]

export function statusMeta(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0]
}
