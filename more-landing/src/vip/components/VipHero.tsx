import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Check,
  Clock,
  Eye,
  FileText,
  Lock,
  MessageCircle,
  Package,
  Sparkles,
  Users,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"
import { cn } from "@/lib/utils"

type VipHeroProps = {
  calendarUrl?: string | null
  vipPaymentLink?: string | null
  vipPrice?: string | null
  loading?: boolean
}

const VIP_VIEWERS_MIN = 87
const VIP_VIEWERS_MAX = 500
const DEFAULT_PAYMENT_LINK = "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"
const DEFAULT_PRICE = "$97"

export const VipHero = ({ calendarUrl, vipPaymentLink, vipPrice, loading }: VipHeroProps) => {
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")
  const effectivePaymentLink = vipPaymentLink || calendarUrl || DEFAULT_PAYMENT_LINK
  const effectivePrice = vipPrice || DEFAULT_PRICE

  const duringBullets = t("vipPage.hero.duringBullets", { returnObjects: true }) as string[]

  const viewersCount = useMemo(
    () =>
      Math.floor(Math.random() * (VIP_VIEWERS_MAX - VIP_VIEWERS_MIN + 1)) + VIP_VIEWERS_MIN,
    [],
  )

  const pricePanelBase =
    "relative overflow-hidden rounded-2xl bg-linear-to-br from-orange via-orange to-orange-dark p-6 text-white shadow-xl shadow-orange/35 ring-1 ring-orange-dark/30"

  const pricePanelLinkExtra =
    "vip-price-card-shine block transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-dark"

  const pricePanelAria = t("vipPage.hero.pricePanelAria", { cta: ctaLabel, price: effectivePrice })

  const pricePanelInner = (
    <>
      <p
        className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/90"
        data-vip-eyebrow="true"
      >
        {t("vipPage.hero.priceEyebrow")}
      </p>
      <p className="mt-2 flex items-baseline justify-center gap-1.5">
        <span className="text-5xl font-bold tracking-tight sm:text-[3.25rem]">{effectivePrice}</span>
        <span className="font-sans text-lg font-semibold text-white/95">
          {t("vipPage.hero.currency")}
        </span>
      </p>
      <p className="mt-2 text-center font-sans text-xs leading-snug text-white/85">
        {t("vipPage.hero.priceSubline")}
      </p>
      <div className="mt-4 h-px w-full bg-white/25" />
      <p className="mt-3 text-center font-sans text-[11px] font-medium text-white/90">
        {t("vipPage.hero.priceCompare")}
      </p>
    </>
  )

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-linear-to-br from-white via-gray-50/50 to-navy/3 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-navy/[0.07] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/3 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="space-y-5"
            >
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
                {t("vipPage.hero.titleBefore")}
                <span className="bg-linear-to-r from-orange to-orange-dark bg-clip-text text-transparent">
                  {t("vipPage.hero.titleHighlight")}
                </span>
                {t("vipPage.hero.titleAfter")}
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                {t("vipPage.hero.subtitle")}
              </p>
              <div className="flex flex-col items-stretch gap-2 sm:max-w-xl sm:items-start">
                <Link
                  to="/#quiz"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border-2 border-navy/20 bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition-all duration-200 hover:border-orange/50 hover:bg-orange/5 hover:text-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                  aria-label={t("vipPage.hero.freeEvalAria")}
                >
                  <span className="rounded-full bg-orange/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-dark">
                    {t("vipPage.hero.freeEvalEyebrow")}
                  </span>
                  {t("vipPage.hero.freeEvalCta")}
                </Link>
                <p className="text-center text-xs leading-relaxed text-gray-500 sm:text-left sm:text-sm">
                  {t("vipPage.hero.freeEvalSub")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-5"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-orange/35 bg-linear-to-br from-white via-white to-orange/[0.07] p-6 shadow-[0_24px_60px_-16px_rgba(42,58,74,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-navy/5 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange/20 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-navy/8 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute right-6 top-6 hidden h-14 w-14 rounded-full border border-orange/20 bg-orange/10 sm:block"
                  aria-hidden
                />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
                  <div className="min-w-0 flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-orange/25"
                        data-vip-eyebrow="true"
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {t("vipPage.hero.badgeOneOnOne")}
                      </span>
                      <span
                        className="rounded-full bg-navy/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                        data-vip-eyebrow="true"
                      >
                        {t("vipPage.hero.badgeEntryOffer")}
                      </span>
                    </div>

                    <h2 className="text-balance text-[clamp(1.65rem,4vw,2.35rem)] font-semibold leading-[1.15] text-navy">
                      {t("vipPage.hero.cardTitleBefore")}
                      <span className="text-orange-dark">{t("vipPage.hero.cardNameHighlight")}</span>
                    </h2>

                    <div className="max-w-xl space-y-3 font-sans text-base leading-relaxed text-gray-600 sm:text-[17px]">
                      <p>{t("vipPage.hero.bodyP1")}</p>
                      <p>{t("vipPage.hero.bodyP2")}</p>
                      <p>{t("vipPage.hero.bodyP3")}</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Users className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            {t("vipPage.hero.formatLabel")}
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">
                            {t("vipPage.hero.formatValue")}
                          </p>
                        </div>
                      </div>
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Clock className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            {t("vipPage.hero.durationLabel")}
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">
                            {t("vipPage.hero.durationValue")}
                          </p>
                        </div>
                      </div>
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Lock className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            {t("vipPage.hero.privacyLabel")}
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">
                            {t("vipPage.hero.privacyValue")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 rounded-2xl border border-orange/20 bg-linear-to-b from-white/90 to-orange/5 p-4 ring-1 ring-navy/5 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2 border-b border-orange/15 pb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Package className="h-5 w-5" aria-hidden />
                        </div>
                        <p className="font-sans text-base font-bold text-navy sm:text-lg">
                          {t("vipPage.hero.deliverablesTitleBefore")}{" "}
                          <span className="text-orange-dark">{effectivePrice}</span>
                        </p>
                      </div>

                      <div>
                        <p
                          className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500"
                          data-vip-eyebrow="true"
                        >
                          {t("vipPage.hero.duringLabel")}
                        </p>
                        <p className="mt-1 font-sans text-sm font-medium text-navy">
                          {t("vipPage.hero.duringSub")}
                        </p>
                        <ul className="mt-3 space-y-2.5 font-sans text-sm text-gray-800 sm:text-[15px]">
                          {duringBullets.map((line) => (
                            <li key={line} className="flex gap-3">
                              <span
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-sm"
                                aria-hidden
                              >
                                <Check className="h-4 w-4 stroke-3" />
                              </span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p
                          className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500"
                          data-vip-eyebrow="true"
                        >
                          {t("vipPage.hero.afterLabel")}
                        </p>
                        <ul className="mt-3 space-y-3 font-sans text-sm text-gray-800 sm:text-[15px]">
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <Video className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">
                                {t("vipPage.hero.afterRecordingBold")}
                              </span>
                              {t("vipPage.hero.afterRecordingRest")}
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <FileText className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">
                                {t("vipPage.hero.afterPdfBold")}
                              </span>
                              {t("vipPage.hero.afterPdfRest")}
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <MessageCircle className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">
                                {t("vipPage.hero.afterWhatsappBold")}
                              </span>
                              {t("vipPage.hero.afterWhatsappRest")}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 flex-col justify-between gap-6 lg:w-[min(100%,280px)]">
                    {!loading && effectivePaymentLink ? (
                      <a
                        href={effectivePaymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(pricePanelBase, pricePanelLinkExtra)}
                        aria-label={pricePanelAria}
                      >
                        <div className="relative z-10">{pricePanelInner}</div>
                      </a>
                    ) : (
                      <div
                        className={cn(pricePanelBase, "cursor-not-allowed", loading && "animate-pulse")}
                        aria-hidden={loading}
                      >
                        <div className="relative z-10">{pricePanelInner}</div>
                      </div>
                    )}
                    <div className="w-full">
                      <VipCtaButton
                        label={ctaLabel}
                        calendarUrl={effectivePaymentLink}
                        loading={loading}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="mx-auto max-w-2xl py-8 text-center font-sans text-xs leading-relaxed text-gray-500 sm:py-10 sm:text-sm">
                {t("vipPage.hero.ninetyDayNote")}
              </p>

              <div className="grid gap-4 text-xs text-gray-600 sm:grid-cols-2 sm:text-[13px]">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-200">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    {t("vipPage.hero.stat1Eyebrow")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">{t("vipPage.hero.stat1Title")}</p>
                  <p className="mt-1">{t("vipPage.hero.stat1Body")}</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-200">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    {t("vipPage.hero.stat2Eyebrow")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">{t("vipPage.hero.stat2Title")}</p>
                  <p className="mt-1">{t("vipPage.hero.stat2Body")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="mt-8 flex justify-center px-2 sm:mt-10">
          <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border-2 border-orange/45 bg-linear-to-b from-orange/15 to-orange/8 px-5 py-6 text-center shadow-lg shadow-orange/15 sm:px-8 sm:py-8">
            <div className="flex items-center gap-2 text-orange-dark">
              <Eye className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-navy/70">
                {t("vipPage.hero.liveActivityEyebrow")}
              </span>
            </div>
            <p className="font-sans text-navy">
              <span className="block text-3xl font-black tabular-nums tracking-tight text-orange-dark sm:text-4xl md:text-5xl">
                {viewersCount}
              </span>
              <span className="mt-2 block text-base font-extrabold uppercase leading-snug tracking-tight sm:text-lg md:text-xl">
                {t("vipPage.hero.liveViewersLine")}
              </span>
            </p>
            <p className="max-w-md font-sans text-xs font-medium text-navy/75 sm:text-sm">
              {t("vipPage.hero.liveActivityFoot")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
