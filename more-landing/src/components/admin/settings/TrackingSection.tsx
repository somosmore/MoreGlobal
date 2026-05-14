import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Info,
  LineChart,
  Loader2,
  Save,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "settings"
  | "loading"
  | "metaPixelId"
  | "setMetaPixelId"
  | "gtmId"
  | "setGtmId"
  | "ga4Id"
  | "setGa4Id"
  | "trackingEnabled"
  | "setTrackingEnabled"
  | "trackingSaveState"
  | "setTrackingSaveState"
  | "trackingSaveError"
  | "handleSaveTracking"
  | "metaPixelInvalid"
  | "gtmInvalid"
  | "ga4Invalid"
  | "trackingFieldsInvalid"
  | "gtmAndMetaConflict"
>

type EventRow = {
  meta: string
  dataLayer: string
  when: string
  destination: string
}

const EVENT_ROWS: EventRow[] = [
  {
    meta: "PageView",
    dataLayer: "virtual_page_view",
    when: "En cada cambio de ruta del sitio público (SPA).",
    destination: "Meta (directo) o dataLayer (GTM).",
  },
  {
    meta: "ViewContent",
    dataLayer: "masterclass_landing_view",
    when: "Al entrar a /masterclass (vista de la landing).",
    destination: "Meta ViewContent o dataLayer (GTM).",
  },
  {
    meta: "Lead",
    dataLayer: "lead_submitted",
    when: "Quiz de diagnóstico enviado y guardado con éxito.",
    destination: "Meta Lead o dataLayer (GTM).",
  },
  {
    meta: "CompleteRegistration",
    dataLayer: "masterclass_registration",
    when: "Registro exitoso del formulario de la masterclass (respuesta OK del servidor).",
    destination: "Meta CompleteRegistration (píxel directo), dataLayer (GTM) y/o GA4 sign_up.",
  },
  {
    meta: "Schedule",
    dataLayer: "schedule_cta_click",
    when: "Clic en el CTA VIP que abre calendario o pago.",
    destination: "Meta Schedule o dataLayer (GTM).",
  },
]

export default function TrackingSection({
  settings,
  loading,
  metaPixelId,
  setMetaPixelId,
  gtmId,
  setGtmId,
  ga4Id,
  setGa4Id,
  trackingEnabled,
  setTrackingEnabled,
  trackingSaveState,
  setTrackingSaveState,
  trackingSaveError,
  handleSaveTracking,
  metaPixelInvalid,
  gtmInvalid,
  ga4Invalid,
  trackingFieldsInvalid,
  gtmAndMetaConflict,
}: Props) {
  const measurementActive =
    settings.tracking_enabled.trim().toLowerCase() !== "false"

  return (
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
            {gtmAndMetaConflict && (
              <div
                className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900"
                role="status"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Tienes GTM y ID de Meta rellenos a la vez. El sitio prioriza{" "}
                  <strong>solo GTM</strong> para cargar scripts. Evita configurar
                  el mismo píxel dos veces (GTM + este campo) o inflarás eventos
                  duplicados.
                </span>
              </div>
            )}

            {/* Estado actual */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 space-y-3">
              <p className="text-xs font-semibold text-[#2A3A4A] uppercase tracking-wide">
                Estado actual
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                <StatusPill
                  label="Medición global"
                  value={measurementActive ? "Activa" : "Pausada"}
                  active={measurementActive}
                />
                <StatusPill
                  label="Google Tag Manager"
                  value={
                    settings.google_tag_manager_id.trim()
                      ? settings.google_tag_manager_id.trim()
                      : "No configurado"
                  }
                  active={!!settings.google_tag_manager_id.trim()}
                />
                <StatusPill
                  label="Píxel de Meta"
                  value={
                    settings.meta_pixel_id.trim()
                      ? `ID ${settings.meta_pixel_id.trim()}`
                      : "No configurado"
                  }
                  active={!!settings.meta_pixel_id.trim()}
                />
                <StatusPill
                  label="GA4"
                  value={
                    settings.ga4_measurement_id.trim()
                      ? settings.ga4_measurement_id.trim()
                      : "No configurado"
                  }
                  active={!!settings.ga4_measurement_id.trim()}
                />
              </div>
            </div>

            {/* Guía colapsable */}
            <Accordion type="single" collapsible className="rounded-xl border border-slate-100 bg-slate-50">
              <AccordionItem value="guia" className="border-b-0">
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-[#2A3A4A]">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#F37021] shrink-0" aria-hidden="true" />
                    Guía de medición y eventos
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm">
                    <li>
                      <strong className="text-[#2A3A4A]">Píxel de Meta:</strong>{" "}
                      mide visitas y conversiones y las atribuye a tus campañas
                      en Meta Ads (Facebook / Instagram).
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">
                        PageView (virtual):
                      </strong>{" "}
                      en cada cambio de ruta del sitio público el navegador
                      envía una vista de página para que el embudo refleje
                      navegación real (SPA).
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">
                        ViewContent (masterclass):
                      </strong>{" "}
                      al entrar a <code className="font-mono">/masterclass</code>{" "}
                      se envía un evento adicional con{" "}
                      <code className="font-mono">content_name</code>{" "}
                      <em>masterclass_eb2niw</em> para medir el embudo de la
                      landing.
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">Lead:</strong> se
                      registra cuando el visitante envía el quiz de diagnóstico
                      y el lead se guarda correctamente.
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">
                        CompleteRegistration:
                      </strong>{" "}
                      se dispara al registro exitoso del formulario de
                      masterclass.
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">Schedule:</strong> se
                      registra al hacer clic en el CTA que abre el calendario o
                      el pago de Asesoría VIP.
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">
                        Google Tag Manager (GTM):
                      </strong>{" "}
                      contenedor para cargar Meta, GA4 u otras etiquetas sin
                      redeploy. Si usas GTM, configura el píxel allí y deja el
                      ID de Meta vacío aquí para evitar duplicar el mismo píxel.
                    </li>
                    <li>
                      <strong className="text-[#2A3A4A]">GA4 (G-):</strong> ID
                      de medición de Google Analytics 4. Solo se usa si{" "}
                      <strong>no</strong> delegas GA4 dentro de GTM.
                    </li>
                  </ul>

                  <p className="mt-4 text-xs font-semibold text-[#2A3A4A] uppercase tracking-wide">
                    Eventos que envía esta web
                  </p>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Con GTM, mapea los nombres del <code className="font-mono">dataLayer</code> a tus etiquetas Meta.
                  </p>

                  {/* Tabla en desktop */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                          <th className="py-1.5 pr-2 font-medium">Meta</th>
                          <th className="py-1.5 pr-2 font-medium">dataLayer</th>
                          <th className="py-1.5 pr-2 font-medium">Cuándo</th>
                          <th className="py-1.5 font-medium">Destino</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {EVENT_ROWS.map((row) => (
                          <tr key={row.meta} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-1.5 pr-2 font-mono">{row.meta}</td>
                            <td className="py-1.5 pr-2 font-mono">{row.dataLayer}</td>
                            <td className="py-1.5 pr-2">{row.when}</td>
                            <td className="py-1.5">{row.destination}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tarjetas en móvil */}
                  <div className="sm:hidden space-y-2">
                    {EVENT_ROWS.map((row) => (
                      <div
                        key={row.meta}
                        className="rounded-lg border border-gray-100 bg-white p-3 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[#2A3A4A] font-semibold">
                            {row.meta}
                          </span>
                          <span className="font-mono text-gray-500 text-[10px] truncate">
                            {row.dataLayer}
                          </span>
                        </div>
                        <p className="text-gray-600">{row.when}</p>
                        <p className="text-gray-400">{row.destination}</p>
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://developers.facebook.com/docs/meta-pixel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-xs text-[#F37021] font-medium hover:underline"
                  >
                    Documentación Meta Pixel
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Toggle medición activa */}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
              <Switch
                id="tracking-enabled"
                checked={trackingEnabled}
                onCheckedChange={(checked) => {
                  setTrackingEnabled(checked)
                  setTrackingSaveState("idle")
                }}
                aria-labelledby="tracking-enabled-label"
              />
              <div className="flex-1 -mt-0.5">
                <label
                  id="tracking-enabled-label"
                  htmlFor="tracking-enabled"
                  className="text-sm font-medium text-[#2A3A4A] cursor-pointer"
                >
                  Medición activa en el sitio público
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Si desactivas, no se cargan scripts ni eventos (los IDs se
                  guardan).
                </p>
              </div>
            </div>

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
  )
}

function StatusPill({
  label,
  value,
  active,
}: {
  label: string
  value: string
  active: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-white border border-gray-100 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
        {label}
      </span>
      <span
        className={`text-xs font-semibold truncate ${
          active ? "text-[#2A3A4A]" : "text-gray-400"
        }`}
        title={value}
      >
        {value}
      </span>
    </div>
  )
}
