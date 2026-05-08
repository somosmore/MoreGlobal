import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"

export type SaveState = "idle" | "saving" | "success" | "error"

export function useSettingsData() {
  const { settings, loading, refetch } = useSiteSettings()

  // General settings (calendar + VIP)
  const [calendarUrl, setCalendarUrl] = useState("")
  const [vipPaymentLink, setVipPaymentLink] = useState("")
  const [vipPrice, setVipPrice] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Social
  const [instagramUrl, setInstagramUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [socialSaveState, setSocialSaveState] = useState<SaveState>("idle")
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null)

  // Tracking
  const [metaPixelId, setMetaPixelId] = useState("")
  const [gtmId, setGtmId] = useState("")
  const [ga4Id, setGa4Id] = useState("")
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [trackingSaveState, setTrackingSaveState] = useState<SaveState>("idle")
  const [trackingSaveError, setTrackingSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      setCalendarUrl(settings.calendar_url)
      setInstagramUrl(settings.instagram_url)
      setLinkedinUrl(settings.linkedin_url)
      setFacebookUrl(settings.facebook_url)
      setYoutubeUrl(settings.youtube_url)
      setVipPaymentLink(settings.vip_payment_link)
      setVipPrice(settings.vip_price)
      setMetaPixelId(settings.meta_pixel_id)
      setGtmId(settings.google_tag_manager_id)
      setGa4Id(settings.ga4_measurement_id)
      setTrackingEnabled(settings.tracking_enabled.trim().toLowerCase() !== "false")
    }
  }, [loading, settings])

  const handleSave = async () => {
    if (!supabase) {
      setSaveError("No hay conexión con la base de datos.")
      setSaveState("error")
      return
    }

    setSaveState("saving")
    setSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "calendar_url", value: calendarUrl.trim() },
        { key: "vip_payment_link", value: vipPaymentLink.trim() },
        { key: "vip_price", value: vipPrice.trim() },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setSaveError(error.message)
      setSaveState("error")
      return
    }

    setSaveState("success")
    refetch()

    setTimeout(() => setSaveState("idle"), 3000)
  }

  const handleSaveSocial = async () => {
    if (!supabase) {
      setSocialSaveError("No hay conexión con la base de datos.")
      setSocialSaveState("error")
      return
    }

    setSocialSaveState("saving")
    setSocialSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "instagram_url", value: instagramUrl.trim() },
        { key: "linkedin_url", value: linkedinUrl.trim() },
        { key: "facebook_url", value: facebookUrl.trim() },
        { key: "youtube_url", value: youtubeUrl.trim() },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setSocialSaveError(error.message)
      setSocialSaveState("error")
      return
    }

    setSocialSaveState("success")
    refetch()

    setTimeout(() => setSocialSaveState("idle"), 3000)
  }

  const handleSaveTracking = async () => {
    if (!supabase) {
      setTrackingSaveError("No hay conexión con la base de datos.")
      setTrackingSaveState("error")
      return
    }

    setTrackingSaveState("saving")
    setTrackingSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "meta_pixel_id", value: metaPixelId.trim() },
        { key: "google_tag_manager_id", value: gtmId.trim() },
        { key: "ga4_measurement_id", value: ga4Id.trim() },
        { key: "tracking_enabled", value: trackingEnabled ? "true" : "false" },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setTrackingSaveError(error.message)
      setTrackingSaveState("error")
      return
    }

    setTrackingSaveState("success")
    refetch()

    setTimeout(() => setTrackingSaveState("idle"), 3000)
  }

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true
    try {
      new URL(url.trim())
      return true
    } catch {
      return false
    }
  }

  const urlInvalid = calendarUrl.trim().length > 0 && !isValidUrl(calendarUrl)
  const vipPaymentLinkInvalid = vipPaymentLink.trim().length > 0 && !isValidUrl(vipPaymentLink)

  const socialUrlInvalid = [instagramUrl, linkedinUrl, facebookUrl, youtubeUrl].some(
    (v) => v.trim().length > 0 && !isValidUrl(v)
  )

  const metaPixelInvalid =
    metaPixelId.trim().length > 0 && !/^\d+$/.test(metaPixelId.trim())
  const gtmInvalid =
    gtmId.trim().length > 0 && !/^GTM-[A-Z0-9]+$/i.test(gtmId.trim())
  const ga4Invalid =
    ga4Id.trim().length > 0 && !/^G-[A-Z0-9]+$/i.test(ga4Id.trim())
  const trackingFieldsInvalid = metaPixelInvalid || gtmInvalid || ga4Invalid
  const gtmAndMetaConflict =
    gtmId.trim().length > 0 && metaPixelId.trim().length > 0

  return {
    settings,
    loading,

    // General (calendar + VIP)
    calendarUrl, setCalendarUrl,
    vipPaymentLink, setVipPaymentLink,
    vipPrice, setVipPrice,
    saveState, setSaveState,
    saveError,
    handleSave,
    urlInvalid,
    vipPaymentLinkInvalid,

    // Social
    instagramUrl, setInstagramUrl,
    linkedinUrl, setLinkedinUrl,
    facebookUrl, setFacebookUrl,
    youtubeUrl, setYoutubeUrl,
    socialSaveState, setSocialSaveState,
    socialSaveError,
    handleSaveSocial,
    socialUrlInvalid,
    isValidUrl,

    // Tracking
    metaPixelId, setMetaPixelId,
    gtmId, setGtmId,
    ga4Id, setGa4Id,
    trackingEnabled, setTrackingEnabled,
    trackingSaveState, setTrackingSaveState,
    trackingSaveError,
    handleSaveTracking,
    metaPixelInvalid,
    gtmInvalid,
    ga4Invalid,
    trackingFieldsInvalid,
    gtmAndMetaConflict,
  }
}

export type SettingsData = ReturnType<typeof useSettingsData>
