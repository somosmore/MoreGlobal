import { motion } from "framer-motion"
import {
  Brain,
  Compass,
  FileCheck,
  ListChecks,
  Target,
  TriangleAlert,
  UserSearch,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipSectionHeading } from "./VipSectionHeading"

const IDEAL_ICONS = [FileCheck, TriangleAlert, Brain, ListChecks] as const

export const VipWhySection = () => {
  const { t } = useTranslation()
  const idealItems = t("vipPage.why.idealItems", { returnObjects: true }) as string[]

  return (
    <motion.section
      aria-labelledby="vip-why-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <VipSectionHeading
        id="vip-why-heading"
        title={t("vipPage.why.title")}
        highlight={t("vipPage.why.titleHighlight")}
        kicker={t("vipPage.why.kicker")}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col justify-center gap-6">
          <div className="flex gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-deep text-white">
              <UserSearch className="h-7 w-7" aria-hidden />
            </span>
            <p className="border-l border-navy/15 pl-5 font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base">
              <span className="font-semibold text-navy">{t("vipPage.why.strategyLead")}</span>{" "}
              <span className="font-semibold text-orange">{t("vipPage.why.strategyLeadAccent")}</span>{" "}
              {t("vipPage.why.strategyBody")}
            </p>
          </div>

          <div className="flex gap-5 rounded-2xl border border-orange/40 bg-paper-warm/70 p-5 sm:p-6">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy-deep text-white">
              <Compass className="h-7 w-7" aria-hidden />
            </span>
            <p className="border-l border-orange/30 pl-5 font-sans text-[15px] leading-relaxed text-navy sm:text-base">
              <span className="font-semibold">{t("vipPage.why.notACallLead")}</span>{" "}
              {t("vipPage.why.notACallBody")}{" "}
              <span className="font-semibold text-orange">{t("vipPage.why.notACallAccent")}</span>
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-navy/15 bg-white/80 p-6 shadow-[0_24px_60px_-30px_rgba(27,43,68,0.3)] backdrop-blur-sm sm:p-8">
          <div className="flex items-center gap-4 border-b border-navy/10 pb-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-white">
              <Target className="h-7 w-7" aria-hidden />
            </span>
            <h3 className="font-display text-2xl text-orange sm:text-3xl">
              {t("vipPage.why.idealTitle")}
            </h3>
          </div>

          <ul className="mt-2 divide-y divide-dashed divide-navy/12">
            {idealItems.map((item, index) => {
              const Icon = IDEAL_ICONS[index] ?? FileCheck
              return (
                <li key={item} className="flex items-center gap-4 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-paper-warm text-orange ring-1 ring-orange/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="font-sans text-sm leading-relaxed text-navy sm:text-[15px]">{item}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </motion.section>
  )
}
