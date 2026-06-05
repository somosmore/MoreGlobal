import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const avatarColors = [
  "bg-[#0A3161]",
  "bg-orange",
  "bg-teal-600",
  "bg-purple-700",
]

const countryFlags: Record<string, string> = {
  Colombia: "🇨🇴",
  Venezuela: "🇻🇪",
  México: "🇲🇽",
  Mexico: "🇲🇽",
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
}

export function TurboTestimonialsSection() {
  const { t } = useTranslation()
  const items = t("turboPage.testimonials.items", { returnObjects: true }) as Array<{
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
        className="mx-auto max-w-2xl text-center mb-10"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.testimonials.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("turboPage.testimonials.title")}
        </h2>
      </motion.div>

      <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 120 }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px -8px rgba(10,49,97,0.14)" }}
            className="flex flex-col rounded-2xl border border-[#0A3161]/10 bg-white p-6 shadow-sm transition-all"
          >
            <div className="flex gap-0.5 text-yellow-400 mb-4" aria-label="5 estrellas">
              {[...Array(5)].map((_, j) => (
                <span key={j} className="text-sm">★</span>
              ))}
            </div>

            <p className="flex-1 text-sm leading-relaxed text-gray-600 italic">
              &ldquo;{item.quote}&rdquo;
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${avatarColors[i % avatarColors.length]}`}
              >
                {getInitials(item.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate">
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
