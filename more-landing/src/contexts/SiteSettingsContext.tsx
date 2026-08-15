import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, type SiteSetting, type SiteSettingsMap } from "@/lib/supabase"

const DEFAULTS: SiteSettingsMap = {
  calendar_url: "",
  whatsapp_number: "+573132219798",
  contact_phone: "+1 (548) 312-2105",
  contact_email: "info@justmore.net",
  instagram_url: "https://instagram.com/somos.more",
  linkedin_url: "",
  facebook_url: "",
  youtube_url: "",
  vip_payment_link: "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f",
  vip_price: "$97",
  vip_countdown_date: "",
  meta_pixel_id: "",
  google_tag_manager_id: "",
  ga4_measurement_id: "",
  tracking_enabled: "true",
  upp_payment_link: "",
  upp_price: "$2,500",
  upp_countdown_date: "",
  turbo_payment_link: "",
  turbo_price: "$8,000",
  turbo_countdown_date: "",
  wppequipo_enabled: "true",
  // Fechas de las landings de campaña (se editan en Admin → Settings).
  mc_event_date: "2026-05-25T19:00:00-05:00",
  mc_registration_closes_at: "2026-05-27T23:59:59-05:00",
  tn_event_date: "2026-08-06T19:00:00-05:00",
  tn_registration_closes_at: "2026-08-07T23:59:59-05:00",
  we_event_date: "2026-08-20T19:00:00-05:00",
  we_registration_closes_at: "2026-08-21T23:59:59-05:00",
}

type SiteSettingsContextValue = {
  settings: SiteSettingsMap
  loading: boolean
  error: string | null
  refetch: () => void
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULTS,
  loading: true,
  error: null,
  refetch: () => {},
})

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsMap>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = () => setTick((n) => n + 1)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let cancelled = false

    const fetchSettings = async () => {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase!
        .from("site_settings")
        .select("key, value, updated_at")

      if (cancelled) return

      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }

      const map = { ...DEFAULTS }
      ;(data as SiteSetting[]).forEach(({ key, value }) => {
        if (key in map) {
          (map as Record<string, string>)[key] = value ?? ""
        }
      })

      setSettings(map)
      setLoading(false)
    }

    fetchSettings()

    return () => {
      cancelled = true
    }
  }, [tick])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, refetch }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext)
}
