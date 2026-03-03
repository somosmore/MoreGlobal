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
} from "lucide-react"

type SaveState = "idle" | "saving" | "success" | "error"

export default function AdminSettings() {
  const { settings, loading, refetch } = useSiteSettings()

  const [calendarUrl, setCalendarUrl] = useState("")
  const [saveState, setSaveState] = useState<SaveState>("idle")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Sync form with loaded settings
  useEffect(() => {
    if (!loading) {
      setCalendarUrl(settings.calendar_url)
    }
  }, [loading, settings.calendar_url])

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
                      href="https://calendar.google.com/calendar/r/appointments"
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
    </div>
  )
}
