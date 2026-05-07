import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

const benefits = [
  "Qué es la visa EB2-NIW y por qué es la mejor opción para profesionales",
  "Los requisitos reales (no los mitos de internet)",
  "El paso a paso desde cero hasta la aprobación",
  "Errores comunes que retrasan o arruinan tu caso",
  "Cómo empezar HOY sin necesidad de un empleador en EE.UU.",
  "Sesión de preguntas en vivo con Ivon More",
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function MCBenefits() {
  return (
    <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 -mt-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="rounded-2xl bg-white shadow-xl border border-gray-100 p-8 sm:p-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2340] mb-8 text-center">
          En esta masterclass vas a aprender:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((text) => (
            <motion.div
              key={text}
              variants={item}
              whileHover={{ scale: 1.02, x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F37021]/[0.04] transition-colors duration-200 cursor-default"
            >
              <CheckCircle className="h-5 w-5 text-[#F37021] mt-0.5 shrink-0" />
              <span className="text-[#1A2340] text-sm sm:text-base leading-snug">
                {text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
