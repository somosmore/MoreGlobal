import { motion } from "framer-motion"
import { Check, MessageCircle, Quote } from "lucide-react"
import { useTranslation } from "react-i18next"

type UppPlansSectionProps = {
  paymentLink?: string | null
  price?: string | null
  whatsappUrl: string
  loading?: boolean
}

export function UppPlansSection({
  paymentLink,
  price,
  whatsappUrl,
  loading,
}: UppPlansSectionProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$2,500"
  const singleIncludes = t("uppPage.plans.single.includes", { returnObjects: true }) as string[]
  const installmentsIncludes = t("uppPage.plans.installments.includes", {
    returnObjects: true,
  }) as string[]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto mb-12 max-w-2xl text-center"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("uppPage.plans.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {t("uppPage.plans.title")}
        </h2>
        <p className="mt-3 text-base text-gray-500">{t("uppPage.plans.subtitle")}</p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          className="relative overflow-hidden rounded-3xl border-2 border-orange bg-white shadow-xl shadow-orange/10 ring-1 ring-orange/10"
        >
          <div className="bg-gradient-to-r from-orange to-orange-dark px-6 py-2 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              {t("uppPage.plans.recommendedBadge")}
            </span>
          </div>
          <div className="p-7 sm:p-8">
            <h3 className="text-xl font-bold text-navy">{t("uppPage.plans.single.name")}</h3>
            <p className="mt-1 text-sm text-gray-500">{t("uppPage.plans.single.tagline")}</p>

            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-navy sm:text-5xl">
                {loading ? (
                  <span className="inline-block h-11 w-32 animate-pulse rounded-lg bg-gray-200" />
                ) : (
                  effectivePrice
                )}
              </span>
              <span className="text-base font-semibold text-gray-400">
                {t("uppPage.plans.single.currency")}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{t("uppPage.plans.single.priceNote")}</p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("uppPage.plans.single.includesLabel")}
            </p>
            <ul className="mt-3 space-y-2.5">
              {singleIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-orange/8 border border-orange/15 px-4 py-3">
              <span className="text-sm font-semibold text-navy">
                {t("uppPage.plans.single.stackLabel")}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400 line-through">
                  {t("uppPage.plans.single.stackStrike")}
                </span>
                <span className="text-sm font-bold text-orange-dark">
                  {t("uppPage.plans.single.stackFree")}
                </span>
              </span>
            </div>

            <div className="mt-7">
              {loading ? (
                <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200" />
              ) : paymentLink ? (
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange to-orange-dark px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  {t("uppPage.plans.single.cta")}
                </a>
              ) : (
                <span className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gray-200 px-6 py-3 text-sm font-bold text-gray-500">
                  {t("uppPage.cta.comingSoon")}
                </span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 120 }}
          className="relative overflow-hidden rounded-3xl border border-navy/12 bg-white shadow-sm lg:mt-[42px]"
        >
          <div className="p-7 sm:p-8">
            <h3 className="text-xl font-bold text-navy">
              {t("uppPage.plans.installments.name")}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t("uppPage.plans.installments.tagline")}
            </p>

            <div className="mt-5">
              <span className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {t("uppPage.plans.installments.price")}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">
              {t("uppPage.plans.installments.priceNote")}
            </p>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("uppPage.plans.installments.includesLabel")}
            </p>
            <ul className="mt-3 space-y-2.5">
              {installmentsIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy/60" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-navy/5 border border-navy/10 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                {t("uppPage.plans.installments.bonusLabel")}
              </span>
              <span className="text-sm font-semibold text-navy">
                {t("uppPage.plans.installments.bonusValue")}
              </span>
            </div>

            <div className="mt-7">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border-2 border-navy/15 bg-white px-6 py-3 text-sm font-bold text-navy transition-all duration-200 hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
              >
                <MessageCircle className="h-4 w-4" />
                {t("uppPage.plans.installments.cta")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-10 max-w-2xl text-center"
      >
        <Quote className="mx-auto h-7 w-7 text-orange/40" />
        <blockquote className="mt-3 text-lg font-medium italic leading-relaxed text-navy">
          {t("uppPage.plans.quote")}
        </blockquote>
        <figcaption className="mt-3 text-sm font-semibold text-gray-500">
          — {t("uppPage.plans.quoteAuthor")}
        </figcaption>
      </motion.figure>
    </div>
  )
}
