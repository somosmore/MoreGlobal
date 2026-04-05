import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export const VipValueSection = () => {
  const { t } = useTranslation()

  return (
    <motion.section
      className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <h2 className="max-w-xl text-[clamp(1.5rem,2.6vw,1.9rem)] font-semibold leading-snug text-navy">
          {t("vipPage.value.title")}
        </h2>
        <p className="max-w-xl text-sm text-gray-600 sm:text-base">{t("vipPage.value.subtitle")}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-dark">
          {t("vipPage.value.timelineEyebrow")}
        </div>
        <ol className="relative space-y-5 border-l border-orange/30 pl-4 text-sm text-gray-700 sm:text-base">
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">{t("vipPage.value.beforeTitle")}</p>
            <p className="text-gray-700">{t("vipPage.value.beforeBody")}</p>
          </li>
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">{t("vipPage.value.duringTitle")}</p>
            <p className="text-gray-700">{t("vipPage.value.duringBody")}</p>
          </li>
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">{t("vipPage.value.afterTitle")}</p>
            <p className="text-gray-700">{t("vipPage.value.afterBody")}</p>
          </li>
        </ol>
      </div>
    </motion.section>
  )
}
