import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"
import { VipCountdown } from "./VipCountdown"
import { VipSectionHeading } from "./VipSectionHeading"
import type { VipTimeLeft } from "../hooks/useVipOffer"

type VipPricingSectionProps = {
  paymentLink: string
  price: string
  loading?: boolean
  timeLeft?: VipTimeLeft | null
}

export const VipPricingSection = ({
  paymentLink,
  price,
  loading,
  timeLeft,
}: VipPricingSectionProps) => {
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")

  return (
    <motion.section
      aria-labelledby="vip-pricing-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <VipSectionHeading
        id="vip-pricing-heading"
        title={t("vipPage.pricing.title")}
        highlight={t("vipPage.pricing.titleHighlight")}
        kicker={t("vipPage.pricing.kicker")}
      />

      <div className="mt-10 overflow-hidden rounded-3xl border border-navy/15 bg-white shadow-[0_28px_70px_-34px_rgba(27,43,68,0.4)]">
        <div className="h-1.5 w-full bg-linear-to-r from-navy-deep via-orange to-orange-light" aria-hidden />

        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div>
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted">
              {t("vipPage.pricing.eyebrow")}
            </p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-6xl font-bold leading-none text-navy-deep">
                {price}
              </span>
              <span className="font-sans text-lg font-semibold text-ink-muted">
                {t("vipPage.pricing.currency")}
              </span>
            </div>

            <p className="mt-3 font-sans text-[15px] text-navy">{t("vipPage.pricing.sessionLine")}</p>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              <p className="font-sans text-[13px] leading-relaxed text-emerald-900 sm:text-sm">
                {t("vipPage.pricing.guarantee")}
              </p>
            </div>
          </div>

          <div className="w-full space-y-4 lg:w-[300px]">
            <VipCtaButton label={ctaLabel} calendarUrl={paymentLink} loading={loading} />
            <p className="text-center font-sans text-xs leading-relaxed text-ink-muted">
              {t("vipPage.pricing.valueLine")}
            </p>
          </div>
        </div>

        {timeLeft ? (
          <div className="border-t border-navy/10 p-6 sm:p-9 sm:pt-6">
            <VipCountdown timeLeft={timeLeft} />
          </div>
        ) : null}
      </div>
    </motion.section>
  )
}
