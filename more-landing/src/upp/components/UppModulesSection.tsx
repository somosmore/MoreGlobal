import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export function UppModulesSection() {
  const { t } = useTranslation()
  const items = t("uppPage.modules.items", { returnObjects: true }) as Array<{
    number: string
    title: string
    description: string
    value: string
  }>

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.modules.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("uppPage.modules.title")}
        </h2>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-4">
        {items.map((mod, i) => (
          <motion.div
            key={mod.number}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06, type: "spring", stiffness: 120 }}
            whileHover={{ x: 6, boxShadow: "0 12px 30px -8px rgba(10,49,97,0.12)" }}
            className="flex items-start gap-4 rounded-2xl border border-[#0A3161]/10 bg-white p-5 shadow-sm transition-all sm:p-6"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.06, type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A3161] text-white text-sm font-bold"
            >
              {mod.number}
            </motion.span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-navy">{mod.title}</h3>
                <span className="shrink-0 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange-dark">
                  {mod.value}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{mod.description}</p>
            </div>
          </motion.div>

        ))}
      </div>
    </div>
  )
}
