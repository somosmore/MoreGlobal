import { motion } from "framer-motion"
import {
  BookOpen,
  Clock,
  FileText,
  MessageCircle,
  Target,
  Users,
  Video,
} from "lucide-react"
import { useTranslation } from "react-i18next"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  bookOpen: BookOpen,
  video: Video,
  users: Users,
  fileText: FileText,
  messageCircle: MessageCircle,
  target: Target,
  clock: Clock,
}

export function UppBenefitsSection() {
  const { t } = useTranslation()
  const items = t("uppPage.benefits.items", { returnObjects: true }) as Array<{
    icon: string
    title: string
    text: string
  }>

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#F0F4FA] via-white to-[#EDF2F8] p-8 sm:p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-deep">
          {t("uppPage.benefits.eyebrow")}
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
          {t("uppPage.benefits.title")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = iconMap[item.icon] ?? BookOpen
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 150 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="rounded-2xl border border-white bg-white p-6 shadow-sm hover:shadow-lg transition-all"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy-deep"
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <h3 className="text-base font-semibold text-navy-deep">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.text}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
