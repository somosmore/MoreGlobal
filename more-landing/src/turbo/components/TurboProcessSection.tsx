import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Users, Briefcase } from "lucide-react"
import { useTranslation } from "react-i18next"

const PHASE_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-violet-600",
  "bg-orange",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-green-600",
]

export function TurboProcessSection() {
  const { t } = useTranslation()
  const phases = t("turboPage.process.phases", { returnObjects: true }) as Array<{
    weeks: string
    title: string
    tasks: string[]
    responsible: string
    alert: string | null
  }>

  return (
    <div id="turbo-proceso">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center mb-14"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.process.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("turboPage.process.title")}
        </h2>
        <p className="mt-3 text-base text-gray-500">{t("turboPage.process.subtitle")}</p>
      </motion.div>

      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-navy/20 via-orange/30 to-green-500/30 hidden sm:block" />

          <div className="space-y-6">
            {phases.map((phase, i) => {
              const isLast = i === phases.length - 1
              const colorClass = PHASE_COLORS[i] || "bg-navy"

              return (
                <motion.div
                  key={phase.weeks}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 100 }}
                  className="relative flex gap-4 sm:gap-6"
                >
                  <div className="relative flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.08, type: "spring", stiffness: 300 }}
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold shadow-md ${colorClass}`}
                    >
                      {isLast ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </motion.div>
                  </div>

                  <div className="flex-1 pb-2">
                    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${phase.alert ? "border-amber-200" : "border-[#0A3161]/10"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            {phase.weeks}
                          </span>
                          <h3 className="mt-0.5 text-base font-bold text-navy">{phase.title}</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${phase.responsible === "MORE" ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-orange/8 text-orange-dark border border-orange/20"}`}>
                          {phase.responsible === "MORE" ? (
                            <Briefcase className="h-3 w-3" />
                          ) : (
                            <Users className="h-3 w-3" />
                          )}
                          {phase.responsible}
                        </span>
                      </div>

                      <ul className="space-y-1.5">
                        {phase.tasks.map((task) => (
                          <li key={task} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                            {task}
                          </li>
                        ))}
                      </ul>

                      {phase.alert && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                          className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                        >
                          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                          <p className="text-xs font-medium text-amber-700">{phase.alert}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
