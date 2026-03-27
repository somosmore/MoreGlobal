import { motion } from "framer-motion"
import { Shield, Clock, CheckCircle, CalendarDays, Star } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useTranslation } from "react-i18next"

export default function VipSession() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()
  const calendlyUrl = settings.calendar_url

  const deliverables = t("vipSession.deliverables", { returnObjects: true }) as string[]

  return (
    <section id="asesoria-vip" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl border-2 border-[#F37021]/30 bg-gradient-to-br from-[#FFF8F4] to-white shadow-2xl overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-[#F37021] to-[#D4611A]" />

              <div className="px-8 sm:px-12 py-10 sm:py-12">
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F37021]/10 text-[#F37021] text-xs font-semibold uppercase tracking-widest">
                    <Star className="w-3 h-3" />
                    {t("vipSession.eyebrow")}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                    <Clock className="w-3 h-3" />
                    {t("vipSession.limited")}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#2A3A4A] leading-tight tracking-tight mb-4">
                  {t("vipSession.title")}{" "}
                  <span className="text-[#F37021]">{t("vipSession.titleHighlight")}</span>
                </h2>

                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  {t("vipSession.subtitle")}
                </p>

                <ul className="space-y-3 mb-8">
                  {deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#F37021] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 my-8" />

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#2A3A4A]">$97</span>
                      <span className="text-gray-400 text-base font-medium">{t("vipSession.currency")}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{t("vipSession.sessionInfo")}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 sm:max-w-[220px]">
                    <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 leading-snug font-medium">
                      {t("vipSession.guarantee")}
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="h-14 w-full rounded-2xl bg-gray-100 animate-pulse" />
                ) : calendlyUrl ? (
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl
                      bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white font-bold text-base
                      shadow-lg shadow-[#F37021]/30 hover:shadow-xl hover:shadow-[#F37021]/40
                      hover:from-[#D4611A] hover:to-[#C05010] transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                    aria-label={t("vipSession.ctaAriaLabel")}
                  >
                    <CalendarDays className="w-5 h-5 shrink-0" />
                    {t("vipSession.cta")}
                  </a>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl
                      bg-gray-200 text-gray-400 font-bold text-base cursor-not-allowed"
                    aria-label={t("vipSession.comingSoon")}
                  >
                    <CalendarDays className="w-5 h-5 shrink-0" />
                    {t("vipSession.comingSoon")}
                  </button>
                )}

                <p className="text-center text-xs text-gray-400 mt-4 italic">
                  {t("vipSession.valueContrast")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
