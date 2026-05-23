import { motion } from "framer-motion"
import { Sparkles, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { UppCtaButtons } from "./UppCtaButtons"
import { UppCountdown } from "./UppCountdown"

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
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A3161] via-[#0D3B6E] to-[#14477A] py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-orange/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B31942]/5 blur-3xl" />
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] h-3 w-3 rounded-full bg-white/10"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 right-[20%] h-2 w-2 rounded-full bg-orange/20"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 left-[25%] h-2.5 w-2.5 rounded-full bg-white/8"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-16 right-[10%]"
        >
          <Star className="h-4 w-4 text-white/15" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-16 right-[30%]"
        >
          <Star className="h-3 w-3 text-white/10" />
        </motion.div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-14 pb-10 sm:px-6 lg:px-8 lg:pt-18 lg:pb-16">
        <div className="mx-auto max-w-3xl text-center">
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
              className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange/30 badge-shine"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t("uppPage.hero.badge")}
            </motion.span>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("uppPage.hero.titleBefore")}
              <span className="bg-gradient-to-r from-orange to-[#FFD700] bg-clip-text text-transparent">
                {t("uppPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {t("uppPage.hero.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="rounded-2xl bg-white/10 backdrop-blur-sm p-4 ring-1 ring-white/15 text-center transition-colors hover:bg-white/15"
              >
                <p className="text-2xl font-bold text-orange sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-white/60 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="mx-auto inline-flex flex-col items-center gap-2 rounded-2xl border border-orange/40 bg-gradient-to-br from-white/10 to-orange/10 px-8 py-5 shadow-2xl shadow-orange/15 ring-1 ring-white/10 backdrop-blur-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                {t("uppPage.hero.priceEyebrow")}
              </p>
              <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {effectivePrice}
                </span>
                <span className="text-lg font-semibold text-white/50">
                  {t("uppPage.hero.currency")}
                </span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-7 flex justify-center"
          >
            <UppCtaButtons
              paymentLink={paymentLink}
              whatsappUrl={whatsappUrl}
              loading={loading}
            />
          </motion.div>

          {countdownDate && (
            <UppCountdown targetDate={countdownDate} />
          )}
        </div>
      </div>
    </section>
  )
}
