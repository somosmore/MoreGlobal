import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DollarSign,
  ExternalLink,
  Loader2,
} from "lucide-react"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "vipPaymentLink"
  | "setVipPaymentLink"
  | "vipPrice"
  | "setVipPrice"
  | "saveState"
  | "setSaveState"
  | "saveError"
  | "vipPaymentLinkInvalid"
>

export default function VipSessionSection({
  loading,
  vipPaymentLink,
  setVipPaymentLink,
  vipPrice,
  setVipPrice,
  saveState,
  setSaveState,
  saveError,
  vipPaymentLinkInvalid,
}: Props) {
  return (
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
  )
}
