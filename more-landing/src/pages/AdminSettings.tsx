import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import {
  Settings,
  Calendar,
  Save,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  CreditCard,
  DollarSign,
  LineChart,
  Info,
} from "lucide-react"

type SaveState = "idle" | "saving" | "success" | "error"

export default function AdminSettings() {
  const { settings, loading, refetch } = useSiteSettings()

  const [calendarUrl, setCalendarUrl] = useState("")
  const [vipPaymentLink, setVipPaymentLink] = useState("")
  const [vipPrice, setVipPrice] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  const [instagramUrl, setInstagramUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [socialSaveState, setSocialSaveState] = useState<SaveState>("idle")
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null)

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

  const socialFields = [
    {
      id: "instagram-url",
      label: "Instagram",
      value: instagramUrl,
      setValue: setInstagramUrl,
      Icon: Instagram,
      placeholder: "https://instagram.com/tu-cuenta",
    },
    {
      id: "linkedin-url",
      label: "LinkedIn",
      value: linkedinUrl,
      setValue: setLinkedinUrl,
      Icon: Linkedin,
      placeholder: "https://linkedin.com/company/tu-empresa",
    },
    {
      id: "facebook-url",
      label: "Facebook",
      value: facebookUrl,
      setValue: setFacebookUrl,
      Icon: Facebook,
      placeholder: "https://facebook.com/tu-pagina",
    },
    {
      id: "youtube-url",
      label: "YouTube",
      value: youtubeUrl,
      setValue: setYoutubeUrl,
      Icon: Youtube,
      placeholder: "https://youtube.com/@tu-canal",
    },
  ]

  const socialUrlInvalid = socialFields.some(
    (f) => f.value.trim().length > 0 && !isValidUrl(f.value)
  )

  const metaPixelInvalid =
    metaPixelId.trim().length > 0 && !/^\d+$/.test(metaPixelId.trim())
  const gtmInvalid =
    gtmId.trim().length > 0 && !/^GTM-[A-Z0-9]+$/i.test(gtmId.trim())
  const ga4Invalid =
    ga4Id.trim().length > 0 && !/^G-[A-Z0-9]+$/i.test(ga4Id.trim())

  const trackingFieldsInvalid =
    metaPixelInvalid || gtmInvalid || ga4Invalid

  const gtmAndMetaConflict =
    gtmId.trim().length > 0 && metaPixelId.trim().length > 0

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#2A3A4A]/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#2A3A4A]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2A3A4A]">Configuración</h1>
            <p className="text-sm text-gray-500">
              Gestiona los parámetros globales del sitio web
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">

      {/* Medición y píxeles */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F37021]/10 flex items-center justify-center">
            <LineChart className="w-4 h-4 text-[#F37021]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2A3A4A]">
              Medición y píxeles
            </h2>
            <p className="text-xs text-gray-400">
              Meta Ads, Google Tag Manager y GA4 — solo sitio público (no CRM)
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Cargando configuración…
            </div>
          ) : (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 space-y-3">
                <p className="font-semibold text-[#2A3A4A] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#F37021] shrink-0" aria-hidden="true" />
                  Qué hace cada pieza
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm">
                  <li>
                    <strong className="text-[#2A3A4A]">Píxel de Meta:</strong> mide
                    visitas y conversiones y las atribuye a tus campañas en Meta Ads
                    (Facebook / Instagram).
                  </li>
                  <li>
                    <strong className="text-[#2A3A4A]">PageView (virtual):</strong> en
                    cada cambio de ruta del sitio público el navegador envía una vista
                    de página para que el embudo en Meta/GA refleje navegación real
                    (SPA).
                  </li>
                  <li>
                    <strong className="text-[#2A3A4A]">Lead:</strong> se registra
                    cuando el visitante envía el formulario del diagnóstico y el lead
                    se guarda correctamente.
                  </li>
                  <li>
                    <strong className="text-[#2A3A4A]">Schedule:</strong> se registra
                    al hacer clic en el CTA que abre el calendario o pago de Asesoría
                    VIP (enlace externo).
                  </li>
                  <li>
                    <strong className="text-[#2A3A4A]">Google Tag Manager (GTM):</strong>{" "}
                    contenedor para cargar Meta, GA4 u otras etiquetas sin redeploy.
                    Si usas GTM, configura el píxel allí y deja el ID de Meta vacío
                    aquí para evitar duplicar el mismo píxel.
                  </li>
                  <li>
                    <strong className="text-[#2A3A4A]">GA4 (G-):</strong> ID de
                    medición de Google Analytics 4. Solo se usa si{" "}
                    <strong>no</strong> delegas GA4 dentro de GTM.
                  </li>
                </ul>
                <a
                  href="https://developers.facebook.com/docs/meta-pixel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#F37021] font-medium hover:underline"
                >
                  Documentación Meta Pixel
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>

              {gtmAndMetaConflict && (
                <div
                  className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900"
                  role="status"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Tienes GTM y ID de Meta rellenos a la vez. El sitio prioriza{" "}
                    <strong>solo GTM</strong> para cargar scripts. Evita configurar el
                    mismo píxel dos veces (GTM + este campo) o inflarás eventos
                    duplicados.
                  </span>
                </div>
              )}

              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-2">
                <p className="text-xs font-semibold text-[#2A3A4A] uppercase tracking-wide">
                  Resumen de parámetros guardados
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>
                    Medición global:{" "}
                    <strong>
                      {settings.tracking_enabled.trim().toLowerCase() !==
                      "false"
                        ? "activa"
                        : "pausada"}
                    </strong>
                  </li>
                  <li>
                    Google Tag Manager:{" "}
                    <strong>
                      {settings.google_tag_manager_id.trim()
                        ? `configurado (${settings.google_tag_manager_id.trim()})`
                        : "no configurado"}
                    </strong>
                  </li>
                  <li>
                    Meta Pixel:{" "}
                    <strong>
                      {settings.meta_pixel_id.trim()
                        ? `configurado (ID ${settings.meta_pixel_id.trim()})`
                        : "no configurado"}
                    </strong>
                  </li>
                  <li>
                    GA4:{" "}
                    <strong>
                      {settings.ga4_measurement_id.trim()
                        ? settings.ga4_measurement_id.trim()
                        : "no configurado"}
                    </strong>
                  </li>
                </ul>
                <p className="text-xs font-semibold text-[#2A3A4A] pt-2">
                  Eventos que envía esta web (sitio público)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500">
                        <th className="py-1.5 pr-2 font-medium">Evento</th>
                        <th className="py-1.5 pr-2 font-medium">Cuándo</th>
                        <th className="py-1.5 font-medium">Destino típico</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-2 font-mono">PageView / virtual_page_view</td>
                        <td className="py-1.5 pr-2">Cambio de ruta pública</td>
                        <td className="py-1.5">Meta (directo) o dataLayer (GTM)</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 pr-2 font-mono">Lead / lead_submitted</td>
                        <td className="py-1.5 pr-2">Formulario del diagnóstico enviado OK</td>
                        <td className="py-1.5">Meta Lead o dataLayer</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 pr-2 font-mono">Schedule / schedule_cta_click</td>
                        <td className="py-1.5 pr-2">Clic CTA VIP → calendario/pago</td>
                        <td className="py-1.5">Meta Schedule o dataLayer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="tracking-enabled"
                  type="checkbox"
                  checked={trackingEnabled}
                  onChange={(e) => {
                    setTrackingEnabled(e.target.checked)
                    setTrackingSaveState("idle")
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#F37021] focus:ring-[#F37021]"
                />
                <label
                  htmlFor="tracking-enabled"
                  className="text-sm font-medium text-[#2A3A4A]"
                >
                  Medición activa en el sitio público
                </label>
              </div>
              <p className="text-xs text-gray-500 -mt-2 ml-7">
                Si desactivas, no se cargan scripts ni eventos (los IDs se guardan).
              </p>

              <div className="space-y-1.5">
                <label
                  htmlFor="google-tag-manager-id"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  ID contenedor Google Tag Manager (opcional)
                </label>
                <input
                  id="google-tag-manager-id"
                  type="text"
                  value={gtmId}
                  onChange={(e) => {
                    setGtmId(e.target.value)
                    setTrackingSaveState("idle")
                  }}
                  placeholder="GTM-XXXXXXX"
                  autoComplete="off"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none font-mono
                    ${
                      gtmInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {gtmInvalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Formato esperado: GTM- seguido de caracteres alfanuméricos.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="meta-pixel-id"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  ID del píxel de Meta (opcional si usas GTM con el píxel dentro)
                </label>
                <input
                  id="meta-pixel-id"
                  type="text"
                  inputMode="numeric"
                  value={metaPixelId}
                  onChange={(e) => {
                    setMetaPixelId(e.target.value)
                    setTrackingSaveState("idle")
                  }}
                  placeholder="Ej: 123456789012345"
                  autoComplete="off"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none font-mono
                    ${
                      metaPixelInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {metaPixelInvalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Solo números, sin espacios.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="ga4-measurement-id"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  ID de medición GA4 (opcional)
                </label>
                <input
                  id="ga4-measurement-id"
                  type="text"
                  value={ga4Id}
                  onChange={(e) => {
                    setGa4Id(e.target.value)
                    setTrackingSaveState("idle")
                  }}
                  placeholder="G-XXXXXXXXXX"
                  autoComplete="off"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none font-mono
                    ${
                      ga4Invalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {ga4Invalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    Formato esperado: G- seguido de caracteres alfanuméricos.
                  </p>
                )}
              </div>

              {trackingSaveState === "error" && trackingSaveError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{trackingSaveError}</span>
                </div>
              )}

              {trackingSaveState === "success" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Configuración de medición guardada.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTracking}
                  disabled={
                    trackingSaveState === "saving" || trackingFieldsInvalid
                  }
                  className="inline-flex items-center gap-2 bg-[#F37021] hover:bg-[#D4611A] disabled:bg-gray-200 disabled:text-gray-400
                    text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  {trackingSaveState === "saving" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" aria-hidden="true" />
                      Guardar medición
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Calendar URL Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F37021]/10 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#F37021]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2A3A4A]">
              Calendario de Asesorías
            </h2>
            <p className="text-xs text-gray-400">
              URL que se abre al hacer clic en "Agenda tu Asesoría VIP" en el Blueprint
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando configuración…
            </div>
          ) : (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                <p className="font-semibold">¿Cómo obtener la URL?</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>
                    Entra a{" "}
                    <a
                      href="https://calendar.google.com/calendar/u/0/r"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium inline-flex items-center gap-1"
                    >
                      Google Calendar → Appointment Scheduling
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Crea o abre tu página de citas.</li>
                  <li>Copia el enlace de reserva y pégalo abajo.</li>
                </ol>
                <p className="text-blue-600 text-xs mt-2">
                  También puedes usar una URL de Calendly u otro proveedor de agendamiento.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="calendar-url"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  URL del calendario
                </label>
                <input
                  id="calendar-url"
                  type="url"
                  value={calendarUrl}
                  onChange={(e) => {
                    setCalendarUrl(e.target.value)
                    setSaveState("idle")
                  }}
                  placeholder="https://calendar.google.com/calendar/appointments/..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none
                    ${
                      urlInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {urlInvalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    La URL no tiene un formato válido.
                  </p>
                )}
                {calendarUrl.trim() && !urlInvalid && (
                  <a
                    href={calendarUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#F37021] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Probar enlace en nueva pestaña
                  </a>
                )}
              </div>

              {/* Save error */}
              {saveState === "error" && saveError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Success message */}
              {saveState === "success" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  URL guardada correctamente.
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving" || urlInvalid || vipPaymentLinkInvalid}
                  className="inline-flex items-center gap-2 bg-[#F37021] hover:bg-[#D4611A] disabled:bg-gray-200 disabled:text-gray-400
                    text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  {saveState === "saving" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar cambios
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* VIP Session Settings Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F37021]/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-[#F37021]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2A3A4A]">
              Asesoría VIP - Links y Precio
            </h2>
            <p className="text-xs text-gray-400">
              Configura el link de pago y precio mostrado en la página de asesoría VIP
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando configuración…
            </div>
          ) : (
            <>
              {/* Payment Link */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vip-payment-link"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  Link de pago
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="vip-payment-link"
                    type="url"
                    value={vipPaymentLink}
                    onChange={(e) => {
                      setVipPaymentLink(e.target.value)
                      setSaveState("idle")
                    }}
                    placeholder="https://link.fastpaydirect.com/payment-link/..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none
                      ${
                        vipPaymentLinkInvalid
                          ? "border-red-300 bg-red-50 focus:border-red-400"
                          : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                      }`}
                  />
                  {vipPaymentLink.trim() && !vipPaymentLinkInvalid && (
                    <a
                      href={vipPaymentLink.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Probar enlace de pago"
                      className="shrink-0 text-[#F37021] hover:text-[#D4611A] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {vipPaymentLinkInvalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    La URL no tiene un formato válido.
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label
                  htmlFor="vip-price"
                  className="block text-sm font-medium text-[#2A3A4A]"
                >
                  Precio
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input
                    id="vip-price"
                    type="text"
                    value={vipPrice}
                    onChange={(e) => {
                      setVipPrice(e.target.value)
                      setSaveState("idle")
                    }}
                    placeholder="$97 USD"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-colors outline-none focus:border-[#F37021] focus:bg-white"
                  />
                </div>
              </div>

              {/* Save error */}
              {saveState === "error" && saveError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Success message */}
              {saveState === "success" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Configuración guardada correctamente.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Social Networks Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F37021]/10 flex items-center justify-center">
            <Instagram className="w-4 h-4 text-[#F37021]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#2A3A4A]">
              Redes Sociales
            </h2>
            <p className="text-xs text-gray-400">
              URLs que aparecen en el footer del sitio. Deja en blanco para ocultar una red.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando configuración…
            </div>
          ) : (
            <>
              {socialFields.map(({ id, label, value, setValue, Icon, placeholder }) => {
                const invalid = value.trim().length > 0 && !isValidUrl(value)
                return (
                  <div key={id} className="space-y-1.5">
                    <label
                      htmlFor={id}
                      className="flex items-center gap-2 text-sm font-medium text-[#2A3A4A]"
                    >
                      <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={id}
                        type="url"
                        value={value}
                        onChange={(e) => {
                          setValue(e.target.value)
                          setSocialSaveState("idle")
                        }}
                        placeholder={placeholder}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors outline-none
                          ${
                            invalid
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                          }`}
                      />
                      {value.trim() && !invalid && (
                        <a
                          href={value.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Probar enlace de ${label}`}
                          className="shrink-0 text-[#F37021] hover:text-[#D4611A] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {invalid && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        La URL no tiene un formato válido.
                      </p>
                    )}
                  </div>
                )
              })}

              {socialSaveState === "error" && socialSaveError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{socialSaveError}</span>
                </div>
              )}

              {socialSaveState === "success" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Redes sociales guardadas correctamente.
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSaveSocial}
                  disabled={socialSaveState === "saving" || socialUrlInvalid}
                  className="inline-flex items-center gap-2 bg-[#F37021] hover:bg-[#D4611A] disabled:bg-gray-200 disabled:text-gray-400
                    text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  {socialSaveState === "saving" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar redes sociales
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      </div>
    </div>
  )
}
