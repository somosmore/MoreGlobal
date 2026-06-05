import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const COLORS = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-orange to-orange-dark",
  "from-emerald-500 to-emerald-600",
]

export function TurboCommitmentsSection() {
  const { t } = useTranslation()
  const items = t("turboPage.commitments.items", { returnObjects: true }) as Array<{
    number: string
    title: string
    text: string
  }>

  return (
    <div className="rounded-3xl border border-[#0A3161]/10 bg-gradient-to-br from-[#0A1F3D] to-[#0D2A50] p-8 sm:p-12 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-48 w-48 rounded-full bg-white/3"
            style={{ left: `${10 + i * 30}%`, bottom: `${5 + i * 15}%` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-2xl text-center mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.commitments.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {t("turboPage.commitments.title")}
        </h2>
        <p className="mt-3 text-base text-white/60">{t("turboPage.commitments.subtitle")}</p>
      </motion.div>

      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mx-auto max-w-5xl">
        {items.map((item, i) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 120 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm hover:border-white/20 hover:bg-white/8 transition-all"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${COLORS[i]} text-2xl font-bold text-white shadow-lg`}>
              {item.number}
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
            <p className="text-xs text-white/60 leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
