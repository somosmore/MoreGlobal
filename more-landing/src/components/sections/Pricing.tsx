import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  Star,
  MessageCircle,
  Video,
  Target,
  Network,
  Heart,
  Eye,
  Shield,
  Send,
  Check,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useWhatsappUrl } from "@/hooks/useWhatsappUrl"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { CtaButton } from "@/components/brand/CtaButton"
import { Backdrop } from "@/components/brand/Backdrop"

const featureIconsByPlan = [
  [BookOpen, Video, Users, Target, Users],
  [FileText, Target, Network, Send, Users, Heart, Eye],
]

export default function Pricing() {
  const { t } = useTranslation()
  const whatsappUrl = useWhatsappUrl()

  const plans = t("pricing.plans", { returnObjects: true }) as Array<{
    name: string
    badge: string
    ratingValue: string
    ratingText: string
    description: string
    timeline: string
    features: string[]
    cta: string
    whatsappMsg: string
  }>

  return (
    <section id="programas" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <Backdrop variant="section" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SectionHeading
            title={`${t("pricing.title")} `}
            highlight={t("pricing.titleHighlight")}
            kicker={t("pricing.eyebrow")}
            description={t("pricing.subtitle")}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-xl text-center font-display text-sm italic text-ink-muted"
        >
          {t("pricing.costOfInaction")}
        </motion.p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {plans.map((plan, index) => {
            const isPopular = index === 1
            const icons = featureIconsByPlan[index] ?? []
            const prices = ["$2,500", "$8,000"]
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange px-4 py-1.5 text-xs font-semibold text-white">
                      <Star className="h-3 w-3" aria-hidden />
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}

                <div
                  className={`flex h-full flex-col rounded-3xl border p-8 transition-colors duration-300 ${
                    isPopular
                      ? "border-navy-deep bg-navy-deep text-white shadow-[0_24px_60px_-30px_rgba(27,43,68,0.45)]"
                      : "border-navy/15 bg-white shadow-[0_24px_60px_-30px_rgba(27,43,68,0.18)]"
                  }`}
                >
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${
                          isPopular
                            ? "bg-orange/20 text-orange-light"
                            : "bg-paper text-navy/70"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    <h3
                      className={`mt-3 font-display text-xl ${
                        isPopular ? "text-white" : "text-navy-deep"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        isPopular ? "text-white/70" : "text-ink-muted"
                      }`}
                    >
                      {plan.description}
                    </p>

                    <div className="mt-6 mb-6">
                      <span
                        className={`font-display text-4xl font-normal sm:text-5xl ${
                          isPopular ? "text-white" : "text-navy-deep"
                        }`}
                      >
                        {prices[index]}
                      </span>
                      <span
                        className={`ml-2 text-sm ${
                          isPopular ? "text-white/50" : "text-ink-muted"
                        }`}
                      >
                        {t("pricing.currency")}
                      </span>
                    </div>

                    <div
                      className={`mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 ${
                        isPopular ? "bg-white/10" : "bg-paper"
                      }`}
                    >
                      <Clock
                        className={`h-4 w-4 ${
                          isPopular ? "text-orange-light" : "text-ink-muted"
                        }`}
                        aria-hidden
                      />
                      <span
                        className={`text-xs font-medium ${
                          isPopular ? "text-white/80" : "text-navy"
                        }`}
                      >
                        {plan.timeline}
                      </span>
                    </div>

                    <div
                      className={`mb-6 flex items-center gap-2 rounded-xl border p-3 ${
                        isPopular
                          ? "border-white/20 bg-white/10"
                          : "border-navy/10 bg-paper-warm/70"
                      }`}
                    >
                      <Shield
                        className={`h-4 w-4 shrink-0 ${
                          isPopular ? "text-orange-light" : "text-orange-dark"
                        }`}
                        aria-hidden
                      />
                      <span
                        className={`text-xs font-medium ${
                          isPopular ? "text-white/85" : "text-navy"
                        }`}
                      >
                        {t("pricing.riskReversal")}
                      </span>
                    </div>

                    <ul className="mb-8 space-y-3">
                      {plan.features.map((feature, fIdx) => {
                        const Icon = icons[fIdx] ?? Check
                        return (
                          <li key={feature} className="flex items-start gap-3">
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                isPopular ? "bg-orange text-white" : "bg-navy-deep text-white"
                              }`}
                            >
                              <Icon className="h-3 w-3" aria-hidden />
                            </span>
                            <span
                              className={`text-sm ${
                                isPopular ? "text-white/80" : "text-ink-muted"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="mt-auto pt-6">
                    {plan.ratingValue && plan.ratingText && (
                      <div className="mb-4 flex flex-col items-center gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span
                            className={`mr-1 font-semibold ${
                              isPopular ? "text-white" : "text-navy-deep"
                            }`}
                          >
                            {plan.ratingValue}
                          </span>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                isPopular ? "fill-orange-light text-orange-light" : "fill-orange text-orange"
                              }`}
                              aria-hidden
                            />
                          ))}
                        </div>
                        <span className={isPopular ? "text-white/80" : "text-ink-muted"}>
                          {plan.ratingText}
                        </span>
                      </div>
                    )}
                    <CtaButton
                      label={plan.cta}
                      href={whatsappUrl(plan.whatsappMsg)}
                      variant={isPopular ? "whatsapp" : "secondary"}
                      size="lg"
                      icon={isPopular ? MessageCircle : null}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center text-sm italic text-ink-muted"
        >
          {t("pricing.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
