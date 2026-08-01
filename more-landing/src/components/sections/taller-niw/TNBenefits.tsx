import { motion } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"

const benefits = [
  "Por qué no prepararte puede costarte la residencia permanente",
  "Qué cambia en un cambio de estatus y cómo anticiparlo",
  "Checklist de preparación para tu visa (antes de que sea tarde)",
  "Errores que debilitan tu caso en el momento decisivo",
  "Estrategias accionables para tu cambio de estatus",
  "Sesión de preguntas en vivo con Ivon More",
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function TNBenefits() {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="rounded-2xl bg-white shadow-2xl border border-gray-100 p-6 sm:p-8"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-[#F37021]" />
          <h2 className="font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            En este taller aprenderás:
          </h2>
          <Sparkles className="h-5 w-5 text-[#F37021]" />
        </div>

        <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] mb-6 opacity-80" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((text) => (
            <motion.div
              key={text}
              variants={item}
              whileHover={{ scale: 1.02, x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group flex items-start gap-3 p-3 rounded-xl border border-transparent
                hover:bg-gradient-to-r hover:from-[#FFF3EA] hover:to-[#FFF9F5]
                hover:border-[#F37021]/30 hover:shadow-sm
                transition-all duration-200 cursor-default"
            >
              <CheckCircle2 className="h-5 w-5 text-[#F37021] mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm leading-snug text-navy-deep transition-colors duration-200 group-hover:text-orange-dark sm:text-base">
                {text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
