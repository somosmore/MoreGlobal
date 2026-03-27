import { motion } from "framer-motion"
import { Briefcase, Store, GraduationCap, TrendingUp, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

const iconsByIndex = [Briefcase, Store, GraduationCap, TrendingUp]

const stylesByIndex = [
  {
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    tagStyle: "bg-blue-50 text-blue-700",
    proofBg: "bg-blue-50/80",
    proofColor: "text-blue-700",
  },
  {
    borderColor: "border-l-[#F37021]",
    iconBg: "bg-orange-50",
    iconColor: "text-[#F37021]",
    tagStyle: "bg-orange-50 text-orange-700",
    proofBg: "bg-orange-50/80",
    proofColor: "text-orange-700",
  },
  {
    borderColor: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tagStyle: "bg-violet-50 text-violet-700",
    proofBg: "bg-violet-50/80",
    proofColor: "text-violet-700",
  },
  {
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tagStyle: "bg-emerald-50 text-emerald-700",
    proofBg: "bg-emerald-50/80",
    proofColor: "text-emerald-700",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function WhoWeHelp() {
  const { t } = useTranslation()
  const profiles = t("whoWeHelp.profiles", { returnObjects: true }) as Array<{
    title: string
    tags: string[]
    description: string
    proof: string
  }>

  return (
    <section id="quienes-ayudamos" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            {t("whoWeHelp.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            {t("whoWeHelp.title")}{" "}
            <span className="text-[#F37021]">{t("whoWeHelp.titleHighlight")}</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            {t("whoWeHelp.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        >
          {profiles.map((profile, index) => {
            const Icon = iconsByIndex[index]
            const styles = stylesByIndex[index]
            return (
              <motion.div key={index} variants={cardVariants}>
                <div className={`group h-full bg-white border border-gray-200/80 border-l-4 ${styles.borderColor} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${styles.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-[#2A3A4A] leading-snug">
                        {profile.title}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${styles.tagStyle}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-[15px] leading-relaxed flex-1">
                    {profile.description}
                  </p>

                  <div className={`mt-5 px-4 py-3 rounded-xl ${styles.proofBg}`}>
                    <p className={`text-xs font-medium ${styles.proofColor} leading-relaxed`}>
                      <span className="opacity-60 mr-1">{t("whoWeHelp.caseLabel")}</span>
                      {profile.proof}
                    </p>
                  </div>

                  <a
                    href="#quiz"
                    tabIndex={0}
                    aria-label={t("whoWeHelp.ariaLabel", { profile: profile.title })}
                    className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${styles.iconColor} hover:gap-3 transition-all duration-200`}
                  >
                    {t("whoWeHelp.selfCta")}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-500 mt-14 font-medium"
        >
          {t("whoWeHelp.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
