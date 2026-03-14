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
} from "lucide-react"

type SaveState = "idle" | "saving" | "success" | "error"

export default function AdminSettings() {
  const { settings, loading, refetch } = useSiteSettings()

  const [calendarUrl, setCalendarUrl] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  const [instagramUrl, setInstagramUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [socialSaveState, setSocialSaveState] = useState<SaveState>("idle")
  const [socialSaveError, setSocialSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) {
      setCalendarUrl(settings.calendar_url)
      setInstagramUrl(settings.instagram_url)
      setLinkedinUrl(settings.linkedin_url)
      setFacebookUrl(settings.facebook_url)
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

    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "calendar_url", value: calendarUrl.trim() }, { onConflict: "key" })

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
  ]

  const socialUrlInvalid = socialFields.some(
    (f) => f.value.trim().length > 0 && !isValidUrl(f.value)
  )

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
                  disabled={saveState === "saving" || urlInvalid}
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
