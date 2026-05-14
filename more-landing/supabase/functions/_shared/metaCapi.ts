import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

export const getGraphApiVersion = () =>
  Deno.env.get("META_GRAPH_API_VERSION")?.trim() || "v25.0"

export const sha256Hex = async (raw: string): Promise<string> => {
  const data = new TextEncoder().encode(raw)
  const hash = await crypto.subtle.digest("SHA-256", data)
  const bytes = new Uint8Array(hash)
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const hashEmailForMeta = (email: string) =>
  sha256Hex(email.trim().toLowerCase())

export const hashPhoneForMeta = async (phone: string): Promise<string | null> => {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 5) return null
  return sha256Hex(digits)
}

export const getSiteSetting = async (
  supabase: SupabaseClient,
  key: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle()
  if (error) {
    console.error(`[metaCapi] site_settings ${key}:`, error)
    return null
  }
  const v = data?.value
  return typeof v === "string" ? v.trim() : null
}

export const isTrackingEnabledForCapi = async (
  supabase: SupabaseClient
): Promise<boolean> => {
  const v = await getSiteSetting(supabase, "tracking_enabled")
  if (v === null) return true
  return v.trim().toLowerCase() !== "false"
}

export const getMetaPixelId = (supabase: SupabaseClient) =>
  getSiteSetting(supabase, "meta_pixel_id")

export const getClientIp = (req: Request): string | undefined => {
  const cf = req.headers.get("cf-connecting-ip")
  if (cf) return cf.trim()
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  return undefined
}

export type CapiEventPayload = Record<string, unknown>

export const sendPixelCapi = async (
  pixelId: string,
  accessToken: string,
  data: CapiEventPayload[],
  testEventCode?: string | null
): Promise<{ ok: boolean; status: number; body: string }> => {
  const version = getGraphApiVersion()
  const url = new URL(
    `https://graph.facebook.com/${version}/${pixelId}/events`
  )
  url.searchParams.set("access_token", accessToken)
  const body: Record<string, unknown> = { data }
  const test = testEventCode?.trim()
  if (test) body.test_event_code = test
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  return { ok: res.ok, status: res.status, body: text }
}
