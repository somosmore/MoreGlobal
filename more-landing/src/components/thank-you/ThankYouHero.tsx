import { motion } from "framer-motion"
import { CheckCircle2, Mail, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Backdrop } from "@/components/brand/Backdrop"

export const ThankYouHero = () => {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-10">
      <Backdrop variant="hero" />

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange-wash/80 px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {t("thankYouPage.hero.badge")}
          </span>

          <h1 className="mt-7 font-display text-4xl leading-[1.08] text-navy-deep sm:text-5xl lg:text-6xl">
            {t("thankYouPage.hero.titleBefore")}
            <span className="text-orange">{t("thankYouPage.hero.titleHighlight")}</span>
          </h1>

          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden>
            <span className="h-px w-16 bg-navy/50 sm:w-24" />
            <Star className="h-4 w-4 fill-orange text-orange" />
            <span className="h-px w-16 bg-orange sm:w-24" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base">
            {t("thankYouPage.hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          className="mt-10 rounded-3xl border border-navy/15 bg-white/90 p-6 text-left shadow-sm backdrop-blur-sm sm:p-8"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-orange">
            {t("thankYouPage.email.eyebrow")}
          </p>
          <div className="mt-3 flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white">
              <Mail className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl text-navy-deep sm:text-2xl">
                {t("thankYouPage.email.title")}
              </h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                {t("thankYouPage.email.body")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
