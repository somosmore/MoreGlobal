import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"
import { VipCountdown } from "./VipCountdown"
import { VipBackdrop } from "./VipBackdrop"
import { VipSpecsBar } from "./VipSpecsBar"
import type { VipTimeLeft } from "../hooks/useVipOffer"

type VipHeroProps = {
  paymentLink: string
  price: string
  loading?: boolean
  timeLeft?: VipTimeLeft | null
}

export const VipHero = ({ paymentLink, price, loading, timeLeft }: VipHeroProps) => {
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <VipBackdrop variant="hero" />

      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white/80 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-navy backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-orange text-orange" aria-hidden />
            {t("vipPage.hero.badge")}
          </span>

          <h1 className="mt-7 font-display text-5xl leading-[1.05] text-navy-deep sm:text-6xl lg:text-7xl">
            {t("vipPage.hero.titleBefore")}
            <span className="text-orange">{t("vipPage.hero.titleHighlight")}</span>
          </h1>

          {/* Regla con estrella: el separador de la presentación */}
          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-16 bg-navy/50 sm:w-24" />
            <Star className="h-4 w-4 fill-orange text-orange" />
            <span className="h-px w-16 bg-orange sm:w-24" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-balance font-display text-2xl leading-snug text-navy sm:text-3xl">
            {t("vipPage.hero.taglineBefore")}
            <span className="text-orange">{t("vipPage.hero.taglineHighlight")}</span>
            {t("vipPage.hero.taglineAfter")}
          </p>

          <p className="mx-auto mt-5 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base">
            {t("vipPage.hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="mt-10 space-y-5"
        >
          <VipSpecsBar price={price} />

          {timeLeft ? <VipCountdown timeLeft={timeLeft} /> : null}

          <div className="flex flex-col items-center gap-4">
            <VipCtaButton
              label={ctaLabel}
              calendarUrl={paymentLink}
              loading={loading}
              className="max-w-lg sm:text-base"
            />

            <p className="flex items-start justify-center gap-2 text-center font-sans text-xs leading-relaxed text-ink-muted sm:text-[13px]">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
              {t("vipPage.hero.guarantee")}
            </p>

            <Link
              to="/#quiz"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-navy underline-offset-4 transition-colors hover:text-orange-dark hover:underline sm:text-sm"
            >
              {t("vipPage.hero.freeEvalCta")}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
