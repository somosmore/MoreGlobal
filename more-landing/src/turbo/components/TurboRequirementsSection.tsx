import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Briefcase, FileText, User, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useWhatsappUrl } from "@/hooks/useWhatsappUrl"

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  briefcase: Briefcase,
  "file-text": FileText,
  user: User,
}

export function TurboRequirementsSection() {
  const { t } = useTranslation()
  const whatsappUrl = useWhatsappUrl()
  const items = t("turboPage.requirements.items", { returnObjects: true }) as Array<{
    icon: string
    title: string
    text: string
  }>

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.requirements.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("turboPage.requirements.title")}
        </h2>
        <p className="mt-3 text-base text-gray-500">{t("turboPage.requirements.subtitle")}</p>
      </motion.div>

      <div className="mx-auto max-w-4xl grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = ICONS[item.icon] || FileText
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07, type: "spring", stiffness: 120 }}
              className="flex items-start gap-4 rounded-2xl border border-[#0A3161]/10 bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange/10">
                <Icon className="h-5 w-5 text-orange" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 mx-auto max-w-2xl rounded-2xl bg-[#0A3161]/4 border border-[#0A3161]/10 px-6 py-5 text-center"
      >
        <p className="text-sm text-gray-600">
          {t("turboPage.requirements.note")}
        </p>
        <a
          href={whatsappUrl(t("turboPage.cta.whatsappMsg"))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Evaluar mi perfil gratis
        </a>
      </motion.div>
    </div>
  )
}
