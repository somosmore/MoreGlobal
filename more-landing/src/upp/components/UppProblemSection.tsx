import { motion } from "framer-motion"
import { AlertTriangle, Clock, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  alertTriangle: AlertTriangle,
  clock: Clock,
  xCircle: XCircle,
}

export function UppProblemSection() {
  const { t } = useTranslation()
  const points = t("uppPage.problem.points", { returnObjects: true }) as Array<{
    icon: string
    title: string
    description: string
  }>

  return (
    <div className="relative overflow-hidden rounded-3xl border border-navy/15 bg-paper p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.problem.eyebrow")}
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
          {t("uppPage.problem.title")}
        </h2>
      </motion.div>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
        {points.map((point, i) => {
          const Icon = iconMap[point.icon] ?? AlertTriangle
          return (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 30, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.12, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className="rounded-2xl border border-navy/15 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.12, type: "spring", stiffness: 250 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/20 text-red-400 mb-4"
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <h3 className="text-lg font-semibold text-navy-deep">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{point.description}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
