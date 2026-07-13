import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Save,
} from "lucide-react"
import { buildWhatsappUrl } from "@/lib/whatsapp"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "whatsappNumber"
  | "setWhatsappNumber"
  | "contactEmail"
  | "setContactEmail"
  | "contactSaveState"
  | "setContactSaveState"
  | "contactSaveError"
  | "handleSaveContact"
  | "whatsappNumberInvalid"
  | "contactEmailInvalid"
>

export default function ContactSection({
  loading,
  whatsappNumber,
  setWhatsappNumber,
  contactEmail,
  setContactEmail,
  contactSaveState,
  setContactSaveState,
  contactSaveError,
  handleSaveContact,
  whatsappNumberInvalid,
  contactEmailInvalid,
}: Props) {
  const previewUrl = buildWhatsappUrl(whatsappNumber)

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F37021]/10">
          <MessageCircle className="h-4 w-4 text-[#F37021]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#2A3A4A]">Contacto - WhatsApp y email</h2>
          <p className="text-xs text-gray-400">
            El número que usan todos los botones de WhatsApp del sitio público
          </p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando configuración…
          </div>
        ) : (
          <>
            <div className="space-y-1 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold">Un solo número para todo el sitio</p>
              <p className="text-blue-700">
                Este número alimenta los botones de WhatsApp del footer, el quiz, los planes,
                las páginas UPP y Turbo, y el aviso de la Asesoría VIP. El mensaje que se
                pre-carga en cada chat es distinto según la página y vive en las traducciones.
              </p>
              <p className="mt-2 text-xs text-blue-600">
                No afecta los grupos de WhatsApp del taller y la masterclass, ni los números
                de asesores de la sección "WhatsApp Equipo".
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="whatsapp-number" className="block text-sm font-medium text-[#2A3A4A]">
                Número de WhatsApp
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="whatsapp-number"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    setWhatsappNumber(e.target.value)
                    setContactSaveState("idle")
                  }}
                  placeholder="+573132219798"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors
                    ${
                      whatsappNumberInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {whatsappNumber.trim() && !whatsappNumberInvalid && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Probar el enlace de WhatsApp"
                    className="shrink-0 text-[#F37021] transition-colors hover:text-[#D4611A]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              {whatsappNumberInvalid ? (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Ingresa el número con código de país, entre 10 y 15 dígitos.
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Con código de país, sin espacios. Los botones abrirán{" "}
                  <span className="font-medium text-gray-500">{previewUrl}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-sm font-medium text-[#2A3A4A]">
                Email de contacto
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => {
                    setContactEmail(e.target.value)
                    setContactSaveState("idle")
                  }}
                  placeholder="info@justmore.net"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none transition-colors
                    ${
                      contactEmailInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
              </div>
              {contactEmailInvalid && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  El email no tiene un formato válido.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSaveContact}
              disabled={
                contactSaveState === "saving" || whatsappNumberInvalid || contactEmailInvalid
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#2A3A4A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3A4D5E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {contactSaveState === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar
            </button>

            {contactSaveState === "error" && contactSaveError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{contactSaveError}</span>
              </div>
            )}

            {contactSaveState === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Datos de contacto guardados correctamente.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
