import { motion } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"

const benefits = [
  "Qué diferencia hay entre visa y estatus (y por qué la fecha de la visa no es tu permanencia)",
  "Cómo leer tu I-94: período autorizado vs «D/S»",
  "Qué condiciones debes cumplir según tu admisión",
  "Qué pasa cuando cambia tu situación (trabajo, estudios, familia)",
  "Qué significa realmente un cambio de estatus — sin jerga",
  "Un marco simple para leer tu propia historia migratoria",
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

export default function WEBenefits() {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-3xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-[#F37021]" />
          <h2 className="font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            En este webinar vas a clarificar:
          </h2>
          <Sparkles className="h-5 w-5 text-[#F37021]" />
        </div>

        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] opacity-80" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {benefits.map((text) => (
            <motion.div
              key={text}
              variants={item}
              whileHover={{ scale: 1.02, x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group flex cursor-default items-start gap-3 rounded-xl border border-transparent p-3
                transition-all duration-200
                hover:border-[#F37021]/30 hover:bg-gradient-to-r hover:from-[#FFF3EA] hover:to-[#FFF9F5]
                hover:shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F37021] transition-transform duration-200 group-hover:scale-110" />
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
