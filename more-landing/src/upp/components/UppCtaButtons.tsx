import { MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

type UppCtaButtonsProps = {
  paymentLink?: string | null
  whatsappUrl: string
  loading?: boolean
  layout?: "row" | "stack"
}

export function UppCtaButtons({
  paymentLink,
  whatsappUrl,
  loading,
  layout = "row",
}: UppCtaButtonsProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
        <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse sm:w-56" />
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse sm:w-56" />
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
      {paymentLink ? (
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange/30 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          aria-label={t("uppPage.cta.payNow")}
        >
          {t("uppPage.cta.payNow")}
        </a>
      ) : (
        <span className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gray-300 px-6 py-3 text-sm font-bold text-gray-500 cursor-not-allowed">
          {t("uppPage.cta.comingSoon")}
        </span>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-green-400/50 hover:bg-green-500/20 hover:text-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        aria-label={t("uppPage.cta.talkToAdvisor")}
      >
        <MessageCircle className="h-4 w-4" />
        {t("uppPage.cta.talkToAdvisor")}
      </a>
    </div>
  )
}
