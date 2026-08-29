import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"

export type SaveState = "idle" | "saving" | "success" | "error"

/**
 * Las fechas de campaña se guardan en ISO absoluto (con zona), pero
 * <input type="datetime-local"> solo entiende "YYYY-MM-DDTHH:mm" en hora local.
 */
function toLocalInput(iso: string): string {
  const trimmed = iso.trim()
  if (!trimmed) return ""
  const date = new Date(trimmed)
  if (Number.isNaN(date.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

function toIso(localValue: string): string {
  const trimmed = localValue.trim()
  if (!trimmed) return ""
  const date = new Date(trimmed)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

export function useSettingsData() {
  const { settings, loading, refetch } = useSiteSettings()

  // General settings (calendar + VIP)
  const [calendarUrl, setCalendarUrl] = useState("")
  const [vipPaymentLink, setVipPaymentLink] = useState("")
  const [vipPrice, setVipPrice] = useState("")
  const [vipCountdownDate, setVipCountdownDate] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Social
  const [instagramUrl, setInstagramUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [socialSaveState, setSocialSaveState] = useState<SaveState>("idle")
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null)

  // UPP
  const [uppPaymentLink, setUppPaymentLink] = useState("")
  const [uppPrice, setUppPrice] = useState("")
  const [uppCountdownDate, setUppCountdownDate] = useState("")
  const [uppSaveState, setUppSaveState] = useState<SaveState>("idle")
  const [uppSaveError, setUppSaveError] = useState<string | null>(null)

  // Contacto (WhatsApp + teléfono display + email)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactSaveState, setContactSaveState] = useState<SaveState>("idle")
  const [contactSaveError, setContactSaveError] = useState<string | null>(null)

  // Landings de campaña (masterclass + taller)
  const [mcEventDate, setMcEventDate] = useState("")
  const [mcRegistrationClosesAt, setMcRegistrationClosesAt] = useState("")
  const [tnEventDate, setTnEventDate] = useState("")
  const [tnRegistrationClosesAt, setTnRegistrationClosesAt] = useState("")
  const [weEventDate, setWeEventDate] = useState("")
  const [weRegistrationClosesAt, setWeRegistrationClosesAt] = useState("")
  const [wsEventDate, setWsEventDate] = useState("")
  const [wsRegistrationClosesAt, setWsRegistrationClosesAt] = useState("")
  const [landingsSaveState, setLandingsSaveState] = useState<SaveState>("idle")
  const [landingsSaveError, setLandingsSaveError] = useState<string | null>(null)

  // Tracking
  const [metaPixelId, setMetaPixelId] = useState("")
  const [gtmId, setGtmId] = useState("")
  const [ga4Id, setGa4Id] = useState("")
  const [trackingEnabled, setTrackingEnabled] = useState(true)
  const [trackingSaveState, setTrackingSaveState] = useState<SaveState>("idle")
  const [trackingSaveError, setTrackingSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      const timer = window.setTimeout(() => {
        setCalendarUrl(settings.calendar_url)
        setInstagramUrl(settings.instagram_url)
        setLinkedinUrl(settings.linkedin_url)
        setFacebookUrl(settings.facebook_url)
        setYoutubeUrl(settings.youtube_url)
        setVipPaymentLink(settings.vip_payment_link)
        setVipPrice(settings.vip_price)
        setVipCountdownDate(settings.vip_countdown_date)
        setUppPaymentLink(settings.upp_payment_link)
        setUppPrice(settings.upp_price)
        setUppCountdownDate(settings.upp_countdown_date)
        setWhatsappNumber(settings.whatsapp_number)
        setContactPhone(settings.contact_phone)
        setContactEmail(settings.contact_email)
        setMcEventDate(toLocalInput(settings.mc_event_date))
        setMcRegistrationClosesAt(toLocalInput(settings.mc_registration_closes_at))
        setTnEventDate(toLocalInput(settings.tn_event_date))
        setTnRegistrationClosesAt(toLocalInput(settings.tn_registration_closes_at))
        setWeEventDate(toLocalInput(settings.we_event_date))
        setWeRegistrationClosesAt(toLocalInput(settings.we_registration_closes_at))
        setWsEventDate(toLocalInput(settings.ws_event_date))
        setWsRegistrationClosesAt(toLocalInput(settings.ws_registration_closes_at))
        setMetaPixelId(settings.meta_pixel_id)
        setGtmId(settings.google_tag_manager_id)
        setGa4Id(settings.ga4_measurement_id)
        setTrackingEnabled(settings.tracking_enabled.trim().toLowerCase() !== "false")
      }, 0)
      return () => window.clearTimeout(timer)
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
        { key: "vip_countdown_date", value: vipCountdownDate.trim() },
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

  const handleSaveUpp = async () => {
    if (!supabase) {
      setUppSaveError("No hay conexión con la base de datos.")
      setUppSaveState("error")
      return
    }

    setUppSaveState("saving")
    setUppSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "upp_payment_link", value: uppPaymentLink.trim() },
        { key: "upp_price", value: uppPrice.trim() },
        { key: "upp_countdown_date", value: uppCountdownDate.trim() },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setUppSaveError(error.message)
      setUppSaveState("error")
      return
    }

    setUppSaveState("success")
    refetch()

    setTimeout(() => setUppSaveState("idle"), 3000)
  }

  const handleSaveContact = async () => {
    if (!supabase) {
      setContactSaveError("No hay conexión con la base de datos.")
      setContactSaveState("error")
      return
    }

    setContactSaveState("saving")
    setContactSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "whatsapp_number", value: whatsappNumber.trim() },
        { key: "contact_phone", value: contactPhone.trim() },
        { key: "contact_email", value: contactEmail.trim() },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setContactSaveError(error.message)
      setContactSaveState("error")
      return
    }

    setContactSaveState("success")
    refetch()

    setTimeout(() => setContactSaveState("idle"), 3000)
  }

  const handleSaveLandings = async () => {
    if (!supabase) {
      setLandingsSaveError("No hay conexión con la base de datos.")
      setLandingsSaveState("error")
      return
    }

    setLandingsSaveState("saving")
    setLandingsSaveError(null)

    const { error } = await supabase.from("site_settings").upsert(
      [
        { key: "mc_event_date", value: toIso(mcEventDate) },
        { key: "mc_registration_closes_at", value: toIso(mcRegistrationClosesAt) },
        { key: "tn_event_date", value: toIso(tnEventDate) },
        { key: "tn_registration_closes_at", value: toIso(tnRegistrationClosesAt) },
        { key: "we_event_date", value: toIso(weEventDate) },
        { key: "we_registration_closes_at", value: toIso(weRegistrationClosesAt) },
        { key: "ws_event_date", value: toIso(wsEventDate) },
        { key: "ws_registration_closes_at", value: toIso(wsRegistrationClosesAt) },
      ],
      { onConflict: "key" }
    )

    if (error) {
      setLandingsSaveError(error.message)
      setLandingsSaveState("error")
      return
    }

    setLandingsSaveState("success")
    refetch()

    setTimeout(() => setLandingsSaveState("idle"), 3000)
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

  // Mismo criterio que normalizePhone en lib/wppEquipo: 10 a 15 dígitos con código de país.
  const whatsappDigits = whatsappNumber.replace(/\D/g, "")
  const whatsappNumberInvalid =
    whatsappNumber.trim().length > 0 && (whatsappDigits.length < 10 || whatsappDigits.length > 15)

  const contactEmailInvalid =
    contactEmail.trim().length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())

  const urlInvalid = calendarUrl.trim().length > 0 && !isValidUrl(calendarUrl)
  const vipPaymentLinkInvalid = vipPaymentLink.trim().length > 0 && !isValidUrl(vipPaymentLink)
  const uppPaymentLinkInvalid = uppPaymentLink.trim().length > 0 && !isValidUrl(uppPaymentLink)

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
    vipCountdownDate, setVipCountdownDate,
    saveState, setSaveState,
    saveError,
    handleSave,
    urlInvalid,
    vipPaymentLinkInvalid,

    // UPP
    uppPaymentLink, setUppPaymentLink,
    uppPrice, setUppPrice,
    uppCountdownDate, setUppCountdownDate,
    uppSaveState, setUppSaveState,
    uppSaveError,
    handleSaveUpp,
    uppPaymentLinkInvalid,

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

    // Contacto
    whatsappNumber, setWhatsappNumber,
    contactPhone, setContactPhone,
    contactEmail, setContactEmail,
    contactSaveState, setContactSaveState,
    contactSaveError,
    handleSaveContact,
    whatsappNumberInvalid,
    contactEmailInvalid,

    // Landings de campaña
    mcEventDate, setMcEventDate,
    mcRegistrationClosesAt, setMcRegistrationClosesAt,
    tnEventDate, setTnEventDate,
    tnRegistrationClosesAt, setTnRegistrationClosesAt,
    weEventDate, setWeEventDate,
    weRegistrationClosesAt, setWeRegistrationClosesAt,
    wsEventDate, setWsEventDate,
    wsRegistrationClosesAt, setWsRegistrationClosesAt,
    landingsSaveState, setLandingsSaveState,
    landingsSaveError,
    handleSaveLandings,

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
