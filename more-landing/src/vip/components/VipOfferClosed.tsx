import { motion } from "framer-motion"
import { ArrowRight, CalendarX, MessageCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { VipBackdrop } from "./VipBackdrop"

type VipOfferClosedProps = {
  whatsappNumber?: string | null
}

const DEFAULT_WHATSAPP = "+573132219798"

export const VipOfferClosed = ({ whatsappNumber }: VipOfferClosedProps) => {
  const { t } = useTranslation()

  const digits = (whatsappNumber || DEFAULT_WHATSAPP).replace(/\D/g, "")
  const message = encodeURIComponent(t("vipPage.closed.whatsappMessage"))
  const whatsappUrl = `https://wa.me/${digits}?text=${message}`

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-24">
      <VipBackdrop variant="hero" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto w-full max-w-xl rounded-3xl border border-navy/10 bg-white/90 p-8 text-center shadow-[0_28px_70px_-30px_rgba(27,43,68,0.35)] backdrop-blur-sm sm:p-12"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-deep text-white">
          <CalendarX className="h-6 w-6" aria-hidden />
        </span>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-orange">
          {t("vipPage.closed.eyebrow")}
        </p>

        <h1 className="mt-3 text-balance font-display text-3xl leading-tight text-navy-deep sm:text-4xl">
          {t("vipPage.closed.titleBefore")}
          <span className="text-orange">{t("vipPage.closed.titleHighlight")}</span>
        </h1>

        <p className="mx-auto mt-5 max-w-md font-sans text-[15px] leading-relaxed text-ink-muted">
          {t("vipPage.closed.body")}
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-orange px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-lg shadow-orange/30 transition-all duration-200 hover:bg-orange-dark hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 sm:w-auto"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
          {t("vipPage.closed.whatsappCta")}
        </a>

        <p className="mt-5 font-sans text-xs text-ink-muted">
          <Link
            to="/#quiz"
            className="inline-flex items-center gap-1 font-semibold text-navy underline-offset-4 transition-colors hover:text-orange-dark hover:underline"
          >
            {t("vipPage.closed.quizLink")}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </p>
      </motion.div>
    </section>
  )
}
