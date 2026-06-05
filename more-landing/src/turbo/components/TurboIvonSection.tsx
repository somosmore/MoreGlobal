import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export function TurboIvonSection() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.ivon.eyebrow")}
        </span>
      </motion.div>

      <div className="flex flex-col items-center gap-8 rounded-3xl border border-[#0A3161]/10 bg-gradient-to-br from-[#0A3161]/3 to-white p-8 shadow-sm sm:flex-row sm:gap-10 sm:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
          className="shrink-0"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-orange/30 to-orange/10 blur-lg" />
            <img
              src="/ivon.png"
              alt="Ivon More"
              className="relative h-40 w-40 rounded-full border-4 border-orange object-cover shadow-xl"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-base font-bold text-navy">{t("turboPage.ivon.title")}</p>
            <p className="text-xs font-medium text-orange">{t("turboPage.ivon.role")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1"
        >
          <p className="text-xl font-semibold leading-snug text-navy mb-4">
            {t("turboPage.ivon.subtitle")}
          </p>
          <p className="text-sm leading-relaxed text-gray-500">
            {t("turboPage.ivon.bio")}
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-orange/70">
            {t("turboPage.ivon.tagline")}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
