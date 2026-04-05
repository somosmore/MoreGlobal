import { motion } from "framer-motion"
import { ShieldCheck, TrendingUp, Clock3 } from "lucide-react"
import { useTranslation } from "react-i18next"

export const VipSocialProofSection = () => {
  const { t } = useTranslation()

  return (
    <motion.section
      className="py-32 sm:py-32"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="rounded-3xl bg-navy text-white shadow-xl ring-1 ring-navy/40">
        <div className="border-b border-white/10 px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange/80">
            {t("vipPage.socialProof.eyebrow")}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">
              {t("vipPage.socialProof.title")}
            </h2>
            <p className="max-w-sm text-xs leading-relaxed text-slate-200/90">
              {t("vipPage.socialProof.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-8 sm:grid-cols-3 sm:px-10 sm:py-10">
          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                {t("vipPage.socialProof.stat1Label")}
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">{t("vipPage.socialProof.stat1Value")}</p>
            <p className="text-xs leading-relaxed text-slate-200">
              {t("vipPage.socialProof.stat1Body")}
            </p>
          </article>

          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <TrendingUp className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                {t("vipPage.socialProof.stat2Label")}
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">{t("vipPage.socialProof.stat2Value")}</p>
            <p className="text-xs leading-relaxed text-slate-200">
              {t("vipPage.socialProof.stat2Body")}
            </p>
          </article>

          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Clock3 className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                {t("vipPage.socialProof.stat3Label")}
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">{t("vipPage.socialProof.stat3Value")}</p>
            <p className="text-xs leading-relaxed text-slate-200">
              {t("vipPage.socialProof.stat3Body")}
            </p>
          </article>
        </div>
      </div>
    </motion.section>
  )
}
