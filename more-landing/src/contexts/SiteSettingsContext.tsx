import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, type SiteSetting, type SiteSettingsMap } from "@/lib/supabase"

const DEFAULTS: SiteSettingsMap = {
  calendar_url: "",
  whatsapp_number: "+573132219798",
  contact_email: "info@justmore.net",
  instagram_url: "https://instagram.com/somos.more",
  linkedin_url: "",
  facebook_url: "",
  youtube_url: "",
  vip_payment_link: "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f",
  vip_price: "$97",
  meta_pixel_id: "",
  google_tag_manager_id: "",
  ga4_measurement_id: "",
  tracking_enabled: "true",
  upp_payment_link: "",
  upp_price: "$2,500",
  upp_countdown_date: "",
  wppequipo_enabled: "true",
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
