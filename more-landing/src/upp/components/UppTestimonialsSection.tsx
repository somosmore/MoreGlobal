import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { useTranslation } from "react-i18next"

export function UppTestimonialsSection() {
  const { t } = useTranslation()
  const items = t("uppPage.testimonials.items", { returnObjects: true }) as Array<{
    name: string
    role: string
    country: string
    quote: string
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
          {t("uppPage.testimonials.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("uppPage.testimonials.title")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.12, type: "spring", stiffness: 130 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex flex-col rounded-2xl border border-[#0A3161]/10 bg-white p-6 shadow-sm ring-1 ring-[#0A3161]/5 transition-shadow hover:shadow-lg"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.12, type: "spring", stiffness: 200 }}
            >
              <Quote className="h-8 w-8 text-[#0A3161]/20 mb-4" aria-hidden />
            </motion.div>
            <p className="flex-1 text-sm leading-relaxed text-gray-600 italic">
              "{item.quote}"
            </p>
            <div className="mt-5 border-t border-[#0A3161]/10 pt-4">
              <p className="text-sm font-semibold text-[#0A3161]">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.role} — {item.country}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
