import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Info,
  LineChart,
  Loader2,
  Save,
} from "lucide-react"
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
  )
}
