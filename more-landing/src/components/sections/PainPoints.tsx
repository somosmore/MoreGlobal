import { motion } from "framer-motion"
import { ShieldAlert, FileSearch, UserX } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

const iconsByIndex = [ShieldAlert, FileSearch, UserX]

const colorsByIndex = [
  {
    color: "from-red-500/15 to-red-500/5",
    iconColor: "text-red-500",
    borderColor: "hover:border-red-200",
  },
  {
    color: "from-blue-600/15 to-blue-600/5",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-200",
  },
  {
    color: "from-[#2A3A4A]/15 to-[#2A3A4A]/5",
    iconColor: "text-[#2A3A4A]",
    borderColor: "hover:border-[#2A3A4A]/20",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
}

export default function PainPoints() {
  const { t } = useTranslation()
  const items = t("painPoints.items", { returnObjects: true }) as Array<{ title: string; description: string }>

  return (
    <section id="metodologia" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            {t("painPoints.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            {t("painPoints.title")}
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            {t("painPoints.subtitle")}{" "}
            <span className="text-[#F37021] font-semibold">{t("painPoints.subtitleHighlight")}</span>.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {items.map((point, index) => {
            const Icon = iconsByIndex[index]
            const styles = colorsByIndex[index]
            return (
              <motion.div key={index} variants={cardVariants}>
                <Card className={`h-full border shadow-lg hover:shadow-xl transition-all duration-300 group ${styles.borderColor}`}>
                  <CardContent className="p-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${styles.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${styles.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2A3A4A] mb-3">
                      {point.title}
                    </h3>
                    <p className="text-gray-500 leading-relaxed text-[15px]">
                      {point.description}
                    </p>
                  </CardContent>
                </Card>
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
          {t("painPoints.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
