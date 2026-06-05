import { motion } from "framer-motion"
import { Zap, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { TurboCtaButtons } from "./TurboCtaButtons"
import { UppCountdown } from "@/upp/components/UppCountdown"

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
    <section className="relative w-full overflow-hidden bg-[#0A1F3D]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1F3D] via-[#0D2A50] to-[#0A1F3D]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(243,112,33,0.15),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(243,112,33,0.08),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[680px] w-full max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:min-h-[760px] lg:px-8">
        <div className="w-full max-w-2xl mx-auto text-center lg:mx-0 lg:text-left lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="space-y-5"
          >
            <div className="relative inline-flex">
              <span className="absolute inset-0 rounded-full bg-orange/40 blur-md animate-pulse" />
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
                className="badge-shine relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange to-orange-dark px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-orange/40 ring-2 ring-orange/30"
              >
                <Zap className="h-4 w-4 shrink-0" aria-hidden />
                {t("turboPage.hero.badge")}
              </motion.span>
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
              {t("turboPage.hero.titleBefore")}
              <span className="bg-gradient-to-r from-orange to-[#FFD700] bg-clip-text text-transparent">
                {t("turboPage.hero.titleHighlight")}
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
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
              className="flex items-center justify-between gap-4 rounded-2xl border border-orange/40 bg-gradient-to-br from-white/10 to-orange/10 px-5 py-4 shadow-2xl shadow-orange/15 ring-1 ring-white/10 backdrop-blur-md"
            >
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                  {t("turboPage.hero.priceEyebrow")}
                </p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {loading ? (
                      <span className="inline-block h-10 w-28 animate-pulse rounded-lg bg-white/20" />
                    ) : (
                      effectivePrice
                    )}
                  </span>
                  <span className="text-base font-semibold text-white/50">
                    {t("turboPage.hero.currency")}
                  </span>
                </p>
              </div>
              <div className="hidden h-12 w-px bg-white/15 sm:block" />
              <p className="hidden max-w-[160px] text-xs leading-snug text-white/60 sm:block">
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
              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/55 lg:justify-start">
                <Users className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Cupos limitados para garantizar atención personalizada
              </p>
            )}
          </motion.div>

          {countdownDate && <UppCountdown targetDate={countdownDate} />}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:block lg:ml-16 lg:flex-1"
        >
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-6 rounded-3xl bg-orange/15 blur-3xl" />
            <div className="relative">
              <img
                src="/ivon.png"
                alt="Ivon More — Fundadora MORE"
                className="relative mx-auto w-full max-w-[380px] rounded-3xl object-cover shadow-2xl shadow-black/40 ring-1 ring-white/10"
                style={{ aspectRatio: "3/4", objectPosition: "top center" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)]"
              >
                <div className="rounded-2xl border border-white/20 bg-[#0A1F3D]/80 px-5 py-4 backdrop-blur-md text-center">
                  <p className="text-sm font-bold text-white">Ivon More</p>
                  <p className="text-xs text-orange font-medium mt-0.5">Fundadora & Estratega EB-2 NIW</p>
                  <p className="text-xs text-white/55 mt-1.5 leading-snug">
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
