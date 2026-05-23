import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

type UppValueStackSectionProps = {
  price?: string | null
  loading?: boolean
}

export function UppValueStackSection({ price, loading }: UppValueStackSectionProps) {
  const { t } = useTranslation()
  const effectivePrice = price || "$2,500"
  const items = t("uppPage.valueStack.items", { returnObjects: true }) as Array<{
    label: string
    value: string
  }>

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.valueStack.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("uppPage.valueStack.title")}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 120 }}
        className="mx-auto max-w-xl rounded-3xl border border-[#0A3161]/15 bg-white p-6 shadow-lg ring-1 ring-[#0A3161]/5 sm:p-8"
      >
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06, type: "spring", stiffness: 120 }}
              className="flex items-center justify-between gap-4"
            >
              <span className="text-sm text-gray-700 sm:text-base">{item.label}</span>
              <span className="shrink-0 text-sm font-semibold text-gray-400 line-through sm:text-base">
                {item.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="my-6 h-px bg-[#0A3161]/10" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-base font-semibold text-[#0A3161] sm:text-lg">
            {t("uppPage.valueStack.totalLabel")}
          </span>
          <span className="text-lg font-bold text-gray-400 line-through sm:text-xl">
            {t("uppPage.valueStack.totalValue")}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 150 }}
          className="mt-6 rounded-2xl bg-gradient-to-r from-[#0A3161] via-[#0D3B6E] to-[#14477A] p-6 text-center text-white"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
            {t("uppPage.valueStack.youPayLabel")}
          </p>
          <motion.p
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5, type: "spring", stiffness: 200 }}
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {loading ? (
              <span className="inline-block h-12 w-32 animate-pulse rounded-lg bg-white/20" />
            ) : (
              effectivePrice
            )}
          </motion.p>
          <p className="mt-1 text-sm font-medium text-white/70">USD</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
