import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
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
    <section className="relative w-full overflow-hidden bg-[#0A1F3D]">
      <div className="absolute inset-0">
        <img
          src="/upp/portada-upp.png"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="h-full w-full object-cover object-[28%_center] lg:object-[18%_center]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0A1F3D] via-[#0A1F3D]/85 via-45% to-[#0A1F3D]/10 lg:bg-linear-to-l lg:from-[#0A1F3D] lg:via-[#0A1F3D]/85 lg:via-45% lg:to-[#0A1F3D]/0" />
        <div className="pointer-events-none absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_at_75%_50%,rgba(212,162,76,0.10),transparent_55%)]" />
      </div>

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
              className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange/30 badge-shine"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {t("uppPage.hero.badge")}
            </motion.span>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem] xl:text-6xl">
              {t("uppPage.hero.titleBefore")}
              <span className="bg-linear-to-r from-orange to-[#FFD700] bg-clip-text text-transparent">
                {t("uppPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
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
                className="rounded-2xl bg-white/10 p-3.5 text-center ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15 sm:p-4"
              >
                <p className="text-2xl font-bold text-orange sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs font-medium text-white/65 sm:text-sm">{stat.label}</p>
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
              className="flex items-center justify-between gap-4 rounded-2xl border border-orange/40 bg-linear-to-br from-white/10 to-orange/10 px-5 py-4 shadow-2xl shadow-orange/15 ring-1 ring-white/10 backdrop-blur-md"
            >
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                  {t("uppPage.hero.priceEyebrow")}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {effectivePrice}
                  </span>
                  <span className="text-base font-semibold text-white/50">
                    {t("uppPage.hero.currency")}
                  </span>
                </p>
              </div>
              <div className="hidden h-12 w-px bg-white/15 sm:block" />
              <p className="hidden max-w-[150px] text-xs leading-snug text-white/60 sm:block">
                Pago único · acceso completo
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
            />
          </motion.div>

          {countdownDate && <UppCountdown targetDate={countdownDate} />}
        </div>
      </div>
    </section>
  )
}
