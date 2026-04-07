import { CalendarDays } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { trackScheduleCta } from "@/lib/tracking"

type VipCtaButtonProps = {
  label: string
  calendarUrl?: string | null
  loading?: boolean
  className?: string
  variant?: "primary" | "secondary"
}

export const VipCtaButton = ({
  label,
  calendarUrl,
  loading,
  className,
  variant = "primary",
}: VipCtaButtonProps) => {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const comingSoon = t("vipPage.cta.comingSoon")

  const handleScheduleTracking = () => {
    void trackScheduleCta(settings)
  }

  const baseClasses =
    variant === "primary"
      ? "min-h-[44px] w-full rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange/30 transition-all duration-200 hover:bg-orange-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
      : "min-h-[40px] w-full rounded-full border border-orange/40 bg-white px-4 py-2.5 text-xs font-semibold text-orange shadow-sm hover:bg-orange/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-60"

  if (loading) {
    return (
      <div
        className={cn(
          "h-11 w-full max-w-xs animate-pulse rounded-2xl bg-gray-200",
          variant === "secondary" && "h-10 max-w-[220px] rounded-full",
          className,
        )}
      />
    )
  }

  if (!calendarUrl) {
    return (
      <button
        type="button"
        disabled
        className={cn(baseClasses, className)}
        aria-label={comingSoon}
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        {comingSoon}
      </button>
    )
  }

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleScheduleTracking}
      aria-label={label}
      className={cn(
        baseClasses,
        "flex items-center justify-center",
        className,
      )}
    >
      <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
      {label}
    </a>
  )
}

