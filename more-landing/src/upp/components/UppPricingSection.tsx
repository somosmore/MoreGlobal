import { motion } from "framer-motion"
import { Clock, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"
import { UppCtaButtons } from "./UppCtaButtons"
import { UppCountdown } from "./UppCountdown"

type UppPricingSectionProps = {
  paymentLink?: string | null
  price?: string | null
  whatsappUrl: string
  countdownDate?: string | null
  loading?: boolean
}

export function UppPricingSection({
  paymentLink,
  price,
  whatsappUrl,
  countdownDate,
  loading,
}: UppPricingSectionProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$2,500"

  return (
    <div
      id="upp-pricing"
      className="rounded-3xl border border-orange/20 bg-gradient-to-br from-orange/5 via-orange/8 to-[#FFF8F0] p-8 sm:p-12 relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-40 w-40 rounded-full bg-orange/5"
            style={{ right: `${5 + i * 25}%`, top: `${10 + i * 20}%` }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-8 relative"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.pricing.eyebrow")}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="mx-auto max-w-lg relative"
      >
        <div className="overflow-hidden rounded-3xl border border-orange/20 bg-white shadow-xl">
          <div className="h-2 bg-gradient-to-r from-orange to-orange-dark" />

          <div className="p-8 text-center">
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
              className="mt-4 flex items-baseline justify-center gap-1.5"
            >
              <span className="text-5xl font-bold tracking-tight text-navy sm:text-6xl">
                {loading ? (
                  <span className="inline-block h-14 w-36 animate-pulse rounded-lg bg-gray-200" />
                ) : (
                  effectivePrice
                )}
              </span>
              <span className="text-lg font-semibold text-gray-400">
                {t("uppPage.pricing.currency")}
              </span>
            </motion.p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-lg bg-gray-100 border border-gray-200 px-3 py-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">
                  {t("uppPage.pricing.timeline")}
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 120 }}
              className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 p-3"
            >
              <Shield className="w-4 h-4 shrink-0 text-green-600" />
              <span className="text-xs font-medium text-green-700 text-left">
                {t("uppPage.pricing.guarantee")}
              </span>
            </motion.div>

            <div className="mt-8">
              <UppCtaButtons
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
                layout="stack"
                theme="light"
              />
            </div>

            <p className="mt-4 text-xs text-gray-400 italic">
              {t("uppPage.pricing.urgencyLine")}
            </p>
          </div>
        </div>

        {countdownDate && (
          <UppCountdown targetDate={countdownDate} />
        )}
      </motion.div>
    </div>
  )
}
