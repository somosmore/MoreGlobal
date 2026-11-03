import { supabase } from "@/lib/supabase"

/**
 * Captura de leads parciales para remarketing (tabla `partial_leads`,
 * función `capture_partial_lead`, migración 039). Una fila por visita y
 * formulario: se crea con el email y se completa con los datos que siguen.
 */

export type PartialLeadData = {
  email: string
  nombre?: string
  phone?: string
  pais?: string
  ticketType?: string
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term", string | null>>
  completed?: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim())

/** Id de sesión estable por formulario: si recarga la página, actualiza la misma fila. */
function getSessionId(source: string): string {
  const key = `partial-lead:${source}`
  try {
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

/** Guarda/actualiza el lead parcial. Nunca lanza: el remarketing no debe romper el form. */
export async function capturePartialLead(source: string, data: PartialLeadData): Promise<void> {
  if (!supabase || !isValidEmail(data.email)) return
  try {
    await supabase.rpc("capture_partial_lead", {
      p_session_id: getSessionId(source),
      p_source: source,
      p_email: data.email.trim().toLowerCase(),
      p_nombre: data.nombre?.trim() || null,
      p_phone: data.phone?.trim() || null,
      p_pais: data.pais || null,
      p_ticket_type: data.ticketType || null,
      p_utm_source: data.utm?.utm_source ?? null,
      p_utm_medium: data.utm?.utm_medium ?? null,
      p_utm_campaign: data.utm?.utm_campaign ?? null,
      p_utm_content: data.utm?.utm_content ?? null,
      p_utm_term: data.utm?.utm_term ?? null,
      p_completed: data.completed ?? false,
    })
  } catch {
    // Silencioso a propósito.
  }
}
