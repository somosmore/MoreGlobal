import { motion } from "framer-motion"
import { Briefcase, Store, GraduationCap, TrendingUp, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { BrandIconCircle } from "@/components/brand/BrandIconCircle"
import { CtaButton } from "@/components/brand/CtaButton"
import { Backdrop } from "@/components/brand/Backdrop"

const iconsByIndex = [Briefcase, Store, GraduationCap, TrendingUp] as const
const tonesByIndex = ["navy", "orange", "navy", "orange"] as const

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
    <section id="quienes-ayudamos" className="relative overflow-hidden bg-white py-24 sm:py-32">
      <Backdrop variant="section" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeading
            title={`${t("whoWeHelp.title")} `}
            highlight={t("whoWeHelp.titleHighlight")}
            kicker={t("whoWeHelp.eyebrow")}
            description={t("whoWeHelp.subtitle")}
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6"
        >
          {profiles.map((profile, index) => {
            const Icon = iconsByIndex[index] ?? Briefcase
            const tone = tonesByIndex[index] ?? "navy"
            return (
              <motion.div key={profile.title} variants={cardVariants}>
                <article className="flex h-full flex-col rounded-3xl border border-navy/15 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(27,43,68,0.18)] sm:p-8">
                  <div className="mb-4 flex items-start gap-4">
                    <BrandIconCircle icon={Icon} tone={tone} />
                    <div className="min-w-0">
                      <h3 className="font-display text-lg leading-snug text-navy-deep">
                        {profile.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {profile.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-navy/15 bg-paper px-2 py-0.5 text-[11px] font-medium text-navy"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="flex-1 text-[15px] leading-relaxed text-ink-muted">
                    {profile.description}
                  </p>

                  <div className="mt-5 rounded-xl border border-navy/10 bg-paper-warm/70 px-4 py-3">
                    <p className="text-xs font-medium leading-relaxed text-navy">
                      <span className="mr-1 text-ink-muted">{t("whoWeHelp.caseLabel")}</span>
                      {profile.proof}
                    </p>
                  </div>

                  <div className="mt-4">
                    <CtaButton
                      label={t("whoWeHelp.selfCta")}
                      href="#quiz"
                      variant="secondary"
                      size="md"
                      icon={ArrowRight}
                      ariaLabel={t("whoWeHelp.ariaLabel", { profile: profile.title })}
                      className="w-full sm:w-auto"
                    />
                  </div>
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
          {t("whoWeHelp.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
