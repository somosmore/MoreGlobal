import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipSectionHeading } from "./VipSectionHeading"

export const VipFitSection = () => {
  const { t } = useTranslation()
  const forYou = t("vipPage.fit.forYou", { returnObjects: true }) as string[]
  const notForYou = t("vipPage.fit.notForYou", { returnObjects: true }) as string[]

  return (
    <motion.section
      aria-labelledby="vip-fit-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <VipSectionHeading
        id="vip-fit-heading"
        title={t("vipPage.fit.title")}
        highlight={t("vipPage.fit.titleHighlight")}
        kicker={t("vipPage.fit.kicker")}
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-navy/15 bg-white/80 p-6 backdrop-blur-sm sm:p-8">
          <h3 className="font-display text-2xl text-navy-deep">{t("vipPage.fit.forYouTitle")}</h3>
          <ul className="mt-6 space-y-4">
            {forYou.map((item) => (
              <li key={item} className="flex gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                  <Check className="h-4 w-4 stroke-3" aria-hidden />
                </span>
                <p className="font-sans text-sm leading-relaxed text-navy sm:text-[15px]">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-navy/10 bg-navy-deep/4 p-6 sm:p-8">
          <h3 className="font-display text-2xl text-ink-muted">{t("vipPage.fit.notForYouTitle")}</h3>
          <ul className="mt-6 space-y-4">
            {notForYou.map((item) => (
              <li key={item} className="flex gap-3.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy/12 text-ink-muted">
                  <X className="h-4 w-4 stroke-3" aria-hidden />
                </span>
                <p className="font-sans text-sm leading-relaxed text-ink-muted sm:text-[15px]">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  )
}
