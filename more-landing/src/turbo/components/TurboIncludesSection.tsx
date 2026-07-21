import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"

export function TurboIncludesSection() {
  const { t } = useTranslation()
  const items = t("turboPage.includes.items", { returnObjects: true }) as Array<{
    number: string
    title: string
    description: string
    tag: string
  }>
  const notIncluded = t("turboPage.includes.notIncluded", { returnObjects: true }) as {
    title: string
    items: string[]
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center mb-12"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">
          {t("turboPage.includes.eyebrow")}
        </span>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("turboPage.includes.title")}
        </h2>
        <p className="mt-3 text-base text-gray-500">{t("turboPage.includes.subtitle")}</p>
      </motion.div>

      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.number}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, type: "spring", stiffness: 120 }}
            whileHover={{ x: 4, boxShadow: "0 8px 24px -6px rgba(10,49,97,0.10)" }}
            className="flex items-start gap-4 rounded-2xl border border-navy/15 bg-white p-5 shadow-sm transition-all sm:p-6"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05, type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-deep text-white text-sm font-bold"
            >
              {item.number}
            </motion.span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-navy">{item.title}</h3>
                <span className="shrink-0 rounded-full bg-orange/10 px-3 py-1 text-xs font-semibold text-orange-dark">
                  {item.tag}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-100 bg-red-50 px-6 py-5"
      >
        <p className="text-sm font-semibold text-red-700 mb-3">{notIncluded.title}</p>
        <div className="flex flex-wrap gap-3">
          {notIncluded.items.map((ni) => (
            <span
              key={ni}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600"
            >
              <X className="h-3 w-3" />
              {ni}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-red-500/80">
          Estos servicios pueden coordinarse por separado. Podemos orientarte.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto mt-5 max-w-3xl rounded-2xl border border-green-100 bg-green-50 px-6 py-4"
      >
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {["Envío digital incluido", "Acceso a MORE Academy", "Equipo experto en EB-2 NIW"].map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
              <Check className="h-4 w-4 text-green-500" />
              {b}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
