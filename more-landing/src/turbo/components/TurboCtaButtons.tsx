import { MessageCircle, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

type TurboCtaButtonsProps = {
  paymentLink?: string | null
  whatsappUrl: string
  loading?: boolean
  layout?: "row" | "stack"
  showGuarantee?: boolean
  theme?: "dark" | "light"
}

export function TurboCtaButtons({
  paymentLink,
  whatsappUrl,
  loading,
  layout = "row",
  showGuarantee = false,
  theme = "dark",
}: TurboCtaButtonsProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
        <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse sm:w-56" />
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse sm:w-56" />
      </div>
    )
  }

  const whatsappDark =
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-green-400/50 hover:bg-green-500/20 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
  const whatsappLight =
    "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"

  return (
    <div>
      <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
        {paymentLink ? (
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            {t("turboPage.cta.payNow")}
          </a>
        ) : (
          <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-3 text-sm font-bold text-gray-500 cursor-not-allowed">
            {t("turboPage.cta.comingSoon")}
          </span>
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={theme === "light" ? whatsappLight : whatsappDark}
        >
          <MessageCircle className="h-4 w-4" />
          {t("turboPage.cta.talkToAdvisor")}
        </a>
      </div>

      {showGuarantee && (
        <p
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 text-xs",
            theme === "light" ? "text-gray-500" : "text-white/60"
          )}
        >
          <Shield className="h-3.5 w-3.5 text-green-500 shrink-0" />
          Cupos limitados · Proceso personalizado garantizado
        </p>
      )}
    </div>
  )
}
