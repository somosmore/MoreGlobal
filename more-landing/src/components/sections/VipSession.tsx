import { motion } from "framer-motion"
import { Shield, Clock, Check, CalendarDays, Star } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useTranslation } from "react-i18next"
import { CtaButton } from "@/components/brand/CtaButton"

export default function VipSession() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()
  const vipPaymentLink = settings.vip_payment_link || "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"
  const vipPrice = settings.vip_price || "$97"

  const deliverables = t("vipSession.deliverables", { returnObjects: true }) as string[]

  return (
    <section id="asesoria-vip" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-3xl border border-navy/15 bg-white shadow-[0_28px_70px_-34px_rgba(27,43,68,0.4)]">
              <div
                className="h-1.5 w-full bg-linear-to-r from-navy-deep via-orange to-orange-light"
                aria-hidden
              />

              <div className="px-8 py-10 sm:px-12 sm:py-12">
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-navy">
                    <Star className="h-3 w-3 fill-orange text-orange" aria-hidden />
                    {t("vipSession.eyebrow")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-warm px-3 py-1 text-xs font-semibold text-orange-dark">
                    <Clock className="h-3 w-3" aria-hidden />
                    {t("vipSession.limited")}
                  </span>
                </div>

                <h2 className="mb-4 font-display text-3xl leading-tight text-navy-deep sm:text-4xl">
                  {t("vipSession.title")}{" "}
                  <span className="text-orange">{t("vipSession.titleHighlight")}</span>
                </h2>

                <p className="mb-8 font-sans text-base leading-relaxed text-ink-muted">
                  {t("vipSession.subtitle")}
                </p>

                <ul className="mb-8 space-y-3">
                  {deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white"
                        aria-hidden
                      >
                        <Check className="h-4 w-4 stroke-3" />
                      </span>
                      <span className="font-sans text-sm leading-snug text-navy">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="my-8 border-t border-navy/10" />

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-bold text-navy-deep">{vipPrice}</span>
                      <span className="font-sans text-base font-medium text-ink-muted">
                        {t("vipSession.currency")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-ink-muted" aria-hidden />
                      <span className="font-sans text-sm text-ink-muted">
                        {t("vipSession.sessionInfo")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 sm:max-w-[220px]">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                    <p className="font-sans text-xs font-medium leading-snug text-emerald-900">
                      {t("vipSession.guarantee")}
                    </p>
                  </div>
                </div>

                <CtaButton
                  label={t("vipSession.cta")}
                  href={vipPaymentLink}
                  loading={loading}
                  size="lg"
                  disabledLabel={t("vipSession.comingSoon")}
                  ariaLabel={t("vipSession.ctaAriaLabel")}
                  trackSchedule
                />

                <p className="mt-4 text-center font-sans text-xs italic text-ink-muted">
                  {t("vipSession.valueContrast")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
