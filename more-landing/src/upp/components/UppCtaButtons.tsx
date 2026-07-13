import { MessageCircle, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { CtaButton } from "@/components/brand/CtaButton"

type UppCtaButtonsProps = {
  paymentLink?: string | null
  whatsappUrl: string
  loading?: boolean
  layout?: "row" | "stack"
  showGuarantee?: boolean
  theme?: "dark" | "light"
}

export function UppCtaButtons({
  paymentLink,
  whatsappUrl,
  loading,
  layout = "row",
  showGuarantee = false,
  theme = "dark",
}: UppCtaButtonsProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
        <div className="h-12 w-full animate-pulse rounded-full bg-gray-200 sm:w-56" />
        <div className="h-12 w-full animate-pulse rounded-full bg-gray-100 sm:w-56" />
      </div>
    )
  }

  return (
    <div>
      <div className={cn("flex gap-3", layout === "stack" ? "flex-col" : "flex-col sm:flex-row")}>
        <CtaButton
          label={t("uppPage.cta.payNow")}
          href={paymentLink}
          icon={null}
          disabledLabel={t("uppPage.cta.comingSoon")}
          trackSchedule
          className="font-bold sm:w-auto"
        />

        <CtaButton
          label={t("uppPage.cta.talkToAdvisor")}
          href={whatsappUrl}
          variant="whatsapp"
          icon={MessageCircle}
          className="sm:w-auto"
        />
      </div>

      {showGuarantee && (
        <p
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 text-xs",
            theme === "light" ? "text-ink-muted" : "text-white/60",
          )}
        >
          <Shield className="h-3.5 w-3.5 shrink-0 text-green-500" aria-hidden />
          {t("uppPage.cta.guarantee")}
        </p>
      )}
    </div>
  )
}
