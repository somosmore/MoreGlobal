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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { useWhatsappUrl } from "@/hooks/useWhatsappUrl"

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
    <section id="programas" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            {t("pricing.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            {t("pricing.title")}{" "}
            <span className="text-[#F37021]">{t("pricing.titleHighlight")}</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">{t("pricing.subtitle")}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 text-sm max-w-xl mx-auto mb-14 italic"
        >
          {t("pricing.costOfInaction")}
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white text-xs font-semibold shadow-lg">
                      <Star className="w-3 h-3" />
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}

                <div
                  className={`h-full rounded-3xl p-8 transition-all duration-300 flex flex-col ${
                    isPopular
                      ? "bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] text-white shadow-2xl ring-2 ring-[#F37021]/30"
                      : "bg-white/60 backdrop-blur-sm border border-gray-200/80 shadow-lg hover:shadow-xl"
                  }`}
                  style={
                    isPopular
                      ? {}
                      : {
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(249,250,251,0.6) 100%)",
                          backdropFilter: "blur(20px)",
                        }
                  }
                >
                  <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full ${
                          isPopular
                            ? "bg-[#F37021]/20 text-[#F37021]"
                            : "bg-[#2A3A4A]/5 text-[#2A3A4A]/60"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>

                    <h3
                      className={`text-xl font-bold mt-3 ${
                        isPopular ? "text-white" : "text-[#2A3A4A]"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        isPopular ? "text-white/60" : "text-gray-500"
                      }`}
                    >
                      {plan.description}
                    </p>

                    <div className="mt-6 mb-6">
                      <span
                        className={`text-4xl font-bold ${
                          isPopular ? "text-white" : "text-[#2A3A4A]"
                        }`}
                      >
                        {prices[index]}
                      </span>
                      <span
                        className={`text-sm ml-2 ${
                          isPopular ? "text-white/50" : "text-gray-400"
                        }`}
                      >
                        {t("pricing.currency")}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${
                        isPopular ? "bg-white/10" : "bg-gray-100"
                      }`}
                    >
                      <Clock
                        className={`w-4 h-4 ${
                          isPopular ? "text-[#F37021]" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isPopular ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {plan.timeline}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-2 mb-6 p-3 rounded-xl ${
                        isPopular
                          ? "bg-white/10 border border-white/20"
                          : "bg-green-50 border border-green-100"
                      }`}
                    >
                      <Shield
                        className={`w-4 h-4 shrink-0 ${
                          isPopular ? "text-green-300" : "text-green-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          isPopular ? "text-green-200" : "text-green-800"
                        }`}
                      >
                        {t("pricing.riskReversal")}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIdx) => {
                        const Icon = icons[fIdx] ?? BookOpen
                        return (
                          <li key={fIdx} className="flex items-start gap-3">
                            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#F37021]" />
                            <span
                              className={`text-sm ${
                                isPopular ? "text-white/80" : "text-gray-600"
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
                      <div className="flex flex-col items-center gap-1 mb-4 text-xs">
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-semibold mr-1 ${
                              isPopular ? "text-white" : "text-[#2A3A4A]"
                            }`}
                          >
                            {plan.ratingValue}
                          </span>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                isPopular ? "text-yellow-300" : "text-yellow-400"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`${
                            isPopular ? "text-white/80" : "text-gray-600"
                          }`}
                        >
                          {plan.ratingText}
                        </span>
                      </div>
                    )}
                    {isPopular ? (
                      <Button variant="gold" className="w-full gap-2" size="lg" asChild>
                        <a href={whatsappUrl(plan.whatsappMsg)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4" />
                          {plan.cta}
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full gap-2" size="lg" asChild>
                        <a href={whatsappUrl(plan.whatsappMsg)} target="_blank" rel="noopener noreferrer">
                          {plan.cta}
                        </a>
                      </Button>
                    )}
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
          className="text-center text-sm text-gray-400 mt-14 italic"
        >
          {t("pricing.bridge")}
        </motion.p>
      </div>
    </section>
  )
}
