import { Clock, Monitor, Tag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

type VipSpecsBarProps = {
  price: string
  className?: string
}

/** Duración · Modalidad · Valor especial — la barra de specs de la presentación. */
export const VipSpecsBar = ({ price, className }: VipSpecsBarProps) => {
  const { t } = useTranslation()

  const specs = [
    {
      icon: Clock,
      label: t("vipPage.specs.durationLabel"),
      value: t("vipPage.specs.durationValue"),
    },
    {
      icon: Monitor,
      label: t("vipPage.specs.modalityLabel"),
      value: t("vipPage.specs.modalityValue"),
    },
    {
      icon: Tag,
      label: t("vipPage.specs.priceLabel"),
      value: t("vipPage.specs.priceValue", { price }),
    },
  ]

  return (
    <div
      className={cn(
        "grid gap-4 rounded-2xl border border-orange/30 bg-white/80 p-5 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-navy/10 sm:p-6",
        className,
      )}
    >
      {specs.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center justify-center gap-3 sm:px-2">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-deep text-white">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-sans text-sm font-medium text-navy">{label}</p>
            <p className="font-display text-lg font-semibold text-orange">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
