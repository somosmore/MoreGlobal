import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const avatarColors = [
  "bg-navy-deep",
  "bg-orange",
  "bg-teal-600",
  "bg-purple-700",
]

const countryFlags: Record<string, string> = {
  Venezuela: "🇻🇪",
  Colombia: "🇨🇴",
  México: "🇲🇽",
  Mexico: "🇲🇽",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1, type: "spring", stiffness: 130 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex flex-col rounded-2xl border border-navy/15 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="flex gap-0.5 text-yellow-400 mb-3" aria-label="5 estrellas">
              {[...Array(5)].map((_, s) => (
                <span key={s} aria-hidden>★</span>
              ))}
            </div>

            <p className="flex-1 text-sm leading-relaxed text-gray-600 italic">
              "{item.quote}"
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-navy/15 pt-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColors[i % avatarColors.length]}`}
                aria-hidden
              >
                {getInitials(item.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-navy-deep">{item.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {item.role} · {countryFlags[item.country] ?? ""} {item.country}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
