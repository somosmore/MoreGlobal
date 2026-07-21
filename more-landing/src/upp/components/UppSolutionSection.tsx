import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"

export function UppSolutionSection() {
  const { t } = useTranslation()
  const highlights = t("uppPage.solution.highlights", { returnObjects: true }) as string[]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-navy/15 bg-paper p-8 sm:p-12">
      <motion.div
        className="absolute inset-0 opacity-10"
        aria-hidden
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-32 w-32 rounded-full bg-white/20"
            style={{ left: `${20 + i * 20}%`, top: `${10 + i * 15}%` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-10 relative"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.solution.eyebrow")}
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
          {t("uppPage.solution.title")}
        </h2>
        <p className="mt-4 text-lg text-ink-muted">{t("uppPage.solution.subtitle")}</p>
      </motion.div>

      <div className="mx-auto max-w-xl space-y-4 relative">
        {highlights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 120 }}
            whileHover={{ x: 6 }}
            className="flex items-start gap-3 rounded-xl border border-navy/15 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-sm"
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </motion.span>
            <span className="text-base text-navy-deep sm:text-lg">{item}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
