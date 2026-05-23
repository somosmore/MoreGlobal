import { motion } from "framer-motion"
import { Briefcase, Building, Globe, GraduationCap } from "lucide-react"
import { useTranslation } from "react-i18next"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  building: Building,
  globe: Globe,
  graduationCap: GraduationCap,
}

export function UppAudienceSection() {
  const { t } = useTranslation()
  const profiles = t("uppPage.audience.profiles", { returnObjects: true }) as Array<{
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
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-orange">
          {t("uppPage.audience.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("uppPage.audience.title")}
        </h2>
        <p className="mt-4 text-gray-500 text-lg">{t("uppPage.audience.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {profiles.map((profile, i) => {
          const Icon = iconMap[profile.icon] ?? Briefcase
          return (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 150 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px -12px rgba(10,49,97,0.15)" }}
              className="rounded-2xl border border-[#0A3161]/10 bg-white p-6 shadow-sm ring-1 ring-[#0A3161]/5 transition-all"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A3161]/10 text-[#0A3161] mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-navy">{profile.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{profile.text}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
