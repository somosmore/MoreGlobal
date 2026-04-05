import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"

const DEFAULT_PAYMENT_LINK = "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"
const DEFAULT_PRICE = "$97"

type VipPricingSectionProps = {
  calendarUrl?: string | null
  vipPaymentLink?: string | null
  vipPrice?: string | null
  loading?: boolean
}

export const VipPricingSection = ({
  calendarUrl,
  vipPaymentLink,
  vipPrice,
  loading,
}: VipPricingSectionProps) => {
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")
  const effectivePaymentLink = vipPaymentLink || calendarUrl || DEFAULT_PAYMENT_LINK
  const effectivePrice = vipPrice || DEFAULT_PRICE

  return (
    <motion.section
      className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-start justify-between gap-4 border-t-4 border-orange/80 pt-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            {t("vipPage.pricing.eyebrow")}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-navy">{effectivePrice}</span>
            <span className="text-sm font-medium text-gray-500">{t("vipPage.pricing.currency")}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{t("vipPage.pricing.sessionLine")}</p>
        </div>
        <div className="w-full max-w-xs">
          <VipCtaButton
            label={ctaLabel}
            calendarUrl={effectivePaymentLink}
            loading={loading}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2 rounded-xl bg-orange/5 px-3 py-2 text-xs text-navy sm:max-w-sm ring-1 ring-orange/25">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
          <p>{t("vipPage.pricing.guarantee")}</p>
        </div>
        <p className="text-xs italic text-gray-500 sm:text-[13px]">{t("vipPage.pricing.valueLine")}</p>
      </div>
      <p className="mt-2 text-center text-xs italic text-gray-400 sm:text-[13px]">
        {t("vipPage.pricing.footerNote", { price: effectivePrice })}
      </p>
    </motion.section>
  )
}
