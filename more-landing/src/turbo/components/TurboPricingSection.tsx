import { motion } from "framer-motion"
import { Clock, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { TurboCtaButtons } from "./TurboCtaButtons"

type TurboPricingSectionProps = {
  paymentLink?: string | null
  price?: string | null
  whatsappUrl: string
  countdownDate?: string | null
  loading?: boolean
}

export function TurboPricingSection({
  paymentLink,
  price,
  whatsappUrl,
  loading,
}: TurboPricingSectionProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$8,000"
  const notIncluded = t("turboPage.pricing.notIncluded", { returnObjects: true }) as {
    title: string
    items: string[]
  }

  return (
    <div
      id="turbo-pricing"
      className="rounded-3xl border border-orange/20 bg-gradient-to-br from-orange/5 via-orange/8 to-[#FFF8F0] p-8 sm:p-12 relative overflow-hidden"
    >
      <motion.div className="absolute inset-0 pointer-events-none" aria-hidden>
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
          {t("turboPage.pricing.eyebrow")}
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
            <p className="text-sm font-semibold text-navy/70">{t("turboPage.pricing.title")}</p>

            <motion.div
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
                {t("turboPage.pricing.currency")}
              </span>
            </motion.div>

            <p className="mt-1 text-xs text-gray-400">{t("turboPage.pricing.priceNote")}</p>

            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gray-100 border border-gray-200 px-4 py-2 w-fit mx-auto">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">
                {t("turboPage.pricing.timeline")}
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-left">
              <p className="text-xs font-semibold text-red-600 mb-2">{notIncluded.title}</p>
              <div className="space-y-1">
                {notIncluded.items.map((ni) => (
                  <div key={ni} className="flex items-center gap-1.5">
                    <X className="h-3 w-3 shrink-0 text-red-400" />
                    <span className="text-xs text-red-500">{ni}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <TurboCtaButtons
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
                layout="stack"
                theme="light"
              />
            </div>

            <p className="mt-4 text-xs text-gray-400 italic">
              {t("turboPage.pricing.urgencyLine")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
