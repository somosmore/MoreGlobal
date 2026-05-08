import {
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Loader2,
  Save,
} from "lucide-react"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "instagramUrl"
  | "setInstagramUrl"
  | "linkedinUrl"
  | "setLinkedinUrl"
  | "facebookUrl"
  | "setFacebookUrl"
  | "youtubeUrl"
  | "setYoutubeUrl"
  | "socialSaveState"
  | "setSocialSaveState"
  | "socialSaveError"
  | "handleSaveSocial"
  | "socialUrlInvalid"
  | "isValidUrl"
>

export default function SocialNetworksSection({
  loading,
  instagramUrl,
  setInstagramUrl,
  linkedinUrl,
  setLinkedinUrl,
  facebookUrl,
  setFacebookUrl,
  youtubeUrl,
  setYoutubeUrl,
  socialSaveState,
  setSocialSaveState,
  socialSaveError,
  handleSaveSocial,
  socialUrlInvalid,
  isValidUrl,
}: Props) {
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

  return (
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
  )
}
