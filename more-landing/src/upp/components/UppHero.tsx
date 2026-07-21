import { motion } from "framer-motion"
import { Sparkles, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { UppCtaButtons } from "./UppCtaButtons"
import { EventCountdown } from "@/components/brand/EventCountdown"
import { Backdrop } from "@/components/brand/Backdrop"

type UppHeroProps = {
  paymentLink?: string | null
  price?: string | null
  countdownDate?: string | null
  whatsappUrl: string
  loading?: boolean
}

export function UppHero({
  paymentLink,
  price,
  countdownDate,
  whatsappUrl,
  loading,
}: UppHeroProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$2,500"
  const stats = t("uppPage.hero.stats", { returnObjects: true }) as Array<{
    value: string
    label: string
  }>

  return (
    <section className="relative w-full overflow-hidden bg-paper">
      <div className="absolute inset-0">
        <img
          src="/upp/portada-upp.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-[28%_center] lg:object-[18%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/85 to-paper/10 lg:bg-gradient-to-l lg:from-paper lg:via-paper/85 lg:via-45% lg:to-paper/0" />
      </div>
      <Backdrop variant="hero" className="opacity-60" />

      <div className="relative mx-auto flex min-h-[640px] w-full max-w-7xl items-end px-4 pb-10 pt-72 sm:min-h-[680px] sm:px-6 sm:pt-80 lg:min-h-[760px] lg:items-center lg:px-8 lg:pb-16 lg:pt-16">
        <div className="ml-auto w-full max-w-xl lg:max-w-[480px] xl:max-w-[520px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="space-y-5"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-orange/30 bg-orange-wash px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-dark"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t("uppPage.hero.badge")}
            </motion.span>

            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              {t("uppPage.hero.titleBefore")}
              <span className="text-orange-dark">
                {t("uppPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {t("uppPage.hero.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 grid grid-cols-2 gap-3"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.04, y: -2 }}
                className="rounded-2xl border border-navy/15 bg-white p-3.5 text-center shadow-sm transition-shadow hover:shadow-md sm:p-4"
              >
                <p className="text-2xl font-bold text-orange sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-ink-muted sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-orange/30 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                  {t("uppPage.hero.priceEyebrow")}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
                    {effectivePrice}
                  </span>
                  <span className="text-base font-semibold text-ink-muted">
                    {t("uppPage.hero.currency")}
                  </span>
                </p>
              </div>
              <div className="hidden h-12 w-px bg-navy/15 sm:block" />
              <p className="hidden max-w-[150px] text-xs leading-snug text-ink-muted sm:block">
                {t("uppPage.hero.priceNote")}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6"
          >
            <UppCtaButtons
              paymentLink={paymentLink}
              whatsappUrl={whatsappUrl}
              loading={loading}
              layout="stack"
              showGuarantee
            />
            {!countdownDate && !loading && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {t("uppPage.hero.limitedSpots")}
              </p>
            )}
          </motion.div>

          {countdownDate && (
            <EventCountdown
              targetDate={countdownDate}
              intro={t("uppPage.hero.countdownLabel")}
              tone="paper"
            />
          )}
        </div>
      </div>
    </section>
  )
}
