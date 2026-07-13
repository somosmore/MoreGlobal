import { useTranslation } from "react-i18next"
import { CtaButton } from "@/components/brand/CtaButton"

type VipCtaButtonProps = {
  label: string
  calendarUrl?: string | null
  loading?: boolean
  className?: string
  variant?: "primary" | "secondary"
}

/** CTA de la página VIP: `CtaButton` con el texto de "próximamente" y el tracking de agendamiento. */
export const VipCtaButton = ({
  label,
  calendarUrl,
  loading,
  className,
  variant = "primary",
}: VipCtaButtonProps) => {
  const { t } = useTranslation()

  return (
    <CtaButton
      label={label}
      href={calendarUrl}
      variant={variant}
      loading={loading}
      disabledLabel={t("vipPage.cta.comingSoon")}
      trackSchedule
      className={className}
    />
  )
}
