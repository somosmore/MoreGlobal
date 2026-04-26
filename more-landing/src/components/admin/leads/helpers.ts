import type { Lead } from "@/lib/supabase"

export type SortField = "created_at" | "nombre" | "result_type" | "status"
export type SortDir = "asc" | "desc"
export type FollowupState = "overdue" | "today" | "soon" | null

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "ahora mismo"
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `hace ${days}d`
  const months = Math.floor(days / 30)
  return `hace ${months} mes${months !== 1 ? "es" : ""}`
}

export function waLink(lead: Lead): string {
  const num = (lead.whatsapp ?? "").replace(/\D/g, "")
  const name = encodeURIComponent(lead.nombre)
  return `https://wa.me/${num}?text=Hola%20${name},%20te%20contactamos%20desde%20MORE%20Immigration%20Consulting.`
}

export function followupState(followup_at: string | null | undefined): FollowupState {
  if (!followup_at) return null
  const now = new Date()
  const fu = new Date(followup_at)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)
  if (fu < todayStart) return "overdue"
  if (fu < todayEnd) return "today"
  const diff = fu.getTime() - todayEnd.getTime()
  if (diff < 3 * 86400000) return "soon"
  return null
}
