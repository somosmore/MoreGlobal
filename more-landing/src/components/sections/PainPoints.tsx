import { motion } from "framer-motion"
import { ShieldAlert, FileSearch, UserX } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { BrandIconCircle } from "@/components/brand/BrandIconCircle"

const iconsByIndex = [ShieldAlert, FileSearch, UserX] as const
const tonesByIndex = ["navy", "orange", "navy"] as const

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
  const items = t("painPoints.items", { returnObjects: true }) as Array<{
    title: string
    description: string
  }>

  return (
    <section id="metodologia" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeading
            title={t("painPoints.title")}
            kicker={t("painPoints.eyebrow")}
          />
          <p className="mx-auto mt-4 max-w-2xl text-center font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base">
            {t("painPoints.subtitle")}{" "}
            <span className="font-semibold text-orange-dark">
              {t("painPoints.subtitleHighlight")}
            </span>
            .
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
        >
          {items.map((point, index) => {
            const Icon = iconsByIndex[index] ?? ShieldAlert
            const tone = tonesByIndex[index] ?? "navy"
            return (
              <motion.div key={point.title} variants={cardVariants}>
                <article className="h-full rounded-3xl border border-navy/15 bg-white p-8 shadow-[0_24px_60px_-30px_rgba(27,43,68,0.18)]">
                  <BrandIconCircle icon={Icon} tone={tone} className="mb-6" />
                  <h3 className="mb-3 font-display text-xl text-navy-deep">{point.title}</h3>
                  <p className="text-[15px] leading-relaxed text-ink-muted">{point.description}</p>
                </article>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center text-sm font-medium text-ink-muted"
        >
          {t("painPoints.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
