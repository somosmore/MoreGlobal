import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  ExternalLink,
  Loader2,
  Save,
} from "lucide-react"
import { useOfferWindow } from "@/hooks/useOfferWindow"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "vipPaymentLink"
  | "setVipPaymentLink"
  | "vipPrice"
  | "setVipPrice"
  | "vipCountdownDate"
  | "setVipCountdownDate"
  | "saveState"
  | "setSaveState"
  | "saveError"
  | "handleSave"
  | "vipPaymentLinkInvalid"
>

/** Devuelve `now + hours` en el formato que espera un input datetime-local. */
function localDateTimeIn(hours: number) {
  const target = new Date(Date.now() + hours * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}` +
    `T${pad(target.getHours())}:${pad(target.getMinutes())}`
  )
}

export default function VipSessionSection({
  loading,
  vipPaymentLink,
  setVipPaymentLink,
  vipPrice,
  setVipPrice,
  vipCountdownDate,
  setVipCountdownDate,
  saveState,
  setSaveState,
  saveError,
  handleSave,
  vipPaymentLinkInvalid,
}: Props) {
  const { expired } = useOfferWindow(vipCountdownDate)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F37021]/10 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-[#F37021]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#2A3A4A]">
            Asesoría VIP - Links, precio y ventana de oferta
          </h2>
          <p className="text-xs text-gray-400">
            Configura el link de pago, el precio y el cierre de la oferta en la página de asesoría VIP
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

            {/* Countdown / cierre de oferta */}
            <div className="space-y-1.5 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <label
                htmlFor="vip-countdown-date"
                className="block text-sm font-medium text-[#2A3A4A]"
              >
                Cierre de la oferta (contador)
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="vip-countdown-date"
                    type="datetime-local"
                    value={vipCountdownDate}
                    onChange={(e) => {
                      setVipCountdownDate(e.target.value)
                      setSaveState("idle")
                    }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm transition-colors outline-none focus:border-[#F37021]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVipCountdownDate(localDateTimeIn(24))
                    setSaveState("idle")
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#F37021]/40 bg-[#F37021]/10 px-4 py-2.5 text-sm font-medium text-[#D4611A] transition-colors hover:bg-[#F37021]/20"
                >
                  <Clock className="w-4 h-4" />
                  Abrir 24 h desde ahora
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Mientras el contador corre, la página muestra la oferta. Al llegar a cero, la página
                se cierra automáticamente y solo queda un aviso con botón de WhatsApp. Déjalo vacío
                para mantener la página siempre disponible.
              </p>
              {vipCountdownDate.trim() && (
                <p
                  className={`text-xs font-medium ${expired ? "text-red-600" : "text-emerald-600"}`}
                >
                  {expired
                    ? "La oferta figura como cerrada: los visitantes ven el aviso con WhatsApp."
                    : "La oferta está abierta y el contador es visible en la página."}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveState === "saving" || vipPaymentLinkInvalid}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A3A4A] text-white text-sm font-medium hover:bg-[#3A4D5E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveState === "saving" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar
            </button>

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
  )
}
