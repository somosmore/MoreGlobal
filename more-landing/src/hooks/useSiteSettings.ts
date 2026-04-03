import { useState, useEffect } from "react"
import { supabase, type SiteSetting, type SiteSettingsMap } from "@/lib/supabase"

const DEFAULTS: SiteSettingsMap = {
  calendar_url: "",
  whatsapp_number: "+18329416026",
  contact_email: "info@justmore.net",
  instagram_url: "https://instagram.com/somos.more",
  linkedin_url: "",
  facebook_url: "",
  youtube_url: "",
  vip_payment_link: "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f",
  vip_price: "$97",
}

type UseSiteSettingsReturn = {
  settings: SiteSettingsMap
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useSiteSettings = (): UseSiteSettingsReturn => {
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

  return { settings, loading, error, refetch }
}
