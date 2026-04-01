import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const baseClasses =
    variant === "primary"
      ? "min-h-[44px] w-full rounded-2xl bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange/30 transition-all duration-200 hover:bg-orange-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
      : "min-h-[40px] w-full rounded-xl border border-orange/40 bg-white px-4 py-2.5 text-xs font-semibold text-orange shadow-sm hover:bg-orange/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-60"

  if (loading) {
    return (
      <div
        className={cn(
          "h-11 w-full max-w-xs animate-pulse rounded-2xl bg-gray-200",
          variant === "secondary" && "h-10 max-w-[220px] rounded-xl",
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
        aria-label="Próximamente disponible"
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        Próximamente disponible
      </button>
    )
  }

  return (
    <a
      href={calendarUrl}
      target="_blank"
      rel="noopener noreferrer"
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

