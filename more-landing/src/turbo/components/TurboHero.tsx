import { motion } from "framer-motion"
import { Zap, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { TurboCtaButtons } from "./TurboCtaButtons"
import { EventCountdown } from "@/components/brand/EventCountdown"
import { Backdrop } from "@/components/brand/Backdrop"

type TurboHeroProps = {
  paymentLink?: string | null
  price?: string | null
  countdownDate?: string | null
  whatsappUrl: string
  loading?: boolean
}

export function TurboHero({
  paymentLink,
  price,
  countdownDate,
  whatsappUrl,
  loading,
}: TurboHeroProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$8,000"
  const stats = t("turboPage.hero.stats", { returnObjects: true }) as Array<{
    value: string
    label: string
  }>

  return (
    <section className="relative w-full overflow-hidden bg-paper">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-paper" />
      </div>
      <Backdrop variant="hero" className="opacity-60" />

      <div className="relative mx-auto flex min-h-[680px] w-full max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[760px] lg:px-8">
        <div className="w-full max-w-2xl mx-auto text-center lg:mx-0 lg:text-left lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="space-y-5"
          >
            <div className="relative inline-flex">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange-wash px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-orange-dark"
              >
                <Zap className="h-4 w-4 shrink-0" aria-hidden />
                {t("turboPage.hero.badge")}
              </motion.span>
            </div>

            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight text-navy-deep sm:text-5xl lg:text-[3.25rem]">
              {t("turboPage.hero.titleBefore")}
              <span className="text-orange-dark">
                {t("turboPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {t("turboPage.hero.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4"
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
                  {t("turboPage.hero.priceEyebrow")}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
                    {loading ? (
                      <span className="inline-block h-10 w-28 animate-pulse rounded-lg bg-white/20" />
                    ) : (
                      effectivePrice
                    )}
                  </span>
                  <span className="text-base font-semibold text-ink-muted">
                    {t("turboPage.hero.currency")}
                  </span>
                </p>
              </div>
              <div className="hidden h-12 w-px bg-navy/15 sm:block" />
              <p className="hidden max-w-[160px] text-xs leading-snug text-ink-muted sm:block">
                {t("turboPage.hero.priceNote")}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6"
          >
            <TurboCtaButtons
              paymentLink={paymentLink}
              whatsappUrl={whatsappUrl}
              loading={loading}
              layout="stack"
              showGuarantee
            />
            {!countdownDate && !loading && (
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-muted lg:justify-start">
                <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Cupos limitados para garantizar atención personalizada
              </p>
            )}
          </motion.div>

          {countdownDate && (
            <EventCountdown
              targetDate={countdownDate}
              intro={t("countdown.offerCloses")}
              tone="paper"
            />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block lg:ml-16 lg:flex-1"
        >
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative">
              <img
                src="/ivon.png"
                alt="Ivon More — Fundadora MORE"
                className="relative mx-auto w-full max-w-[380px] rounded-3xl border border-navy/15 object-cover shadow-xl"
                style={{ aspectRatio: "3/4", objectPosition: "top center" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-5 left-1/2 w-[calc(100%-2.5rem)] -translate-x-1/2"
              >
                <div className="rounded-2xl border border-navy/15 bg-white/95 px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-bold text-navy-deep">Ivon More</p>
                  <p className="mt-0.5 text-xs font-medium text-orange-dark">Fundadora & Estratega EB-2 NIW</p>
                  <p className="mt-1.5 text-xs leading-snug text-ink-muted">
                    Lidera personalmente cada expediente del Plan Turbo
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
