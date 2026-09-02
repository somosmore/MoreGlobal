import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Creía que sabía mi estatus porque tenía la visa vigente. Salí entendiendo qué mirar en el I-94 y qué preguntas hacer antes de cualquier movimiento.",
    name: "Ana M.",
    role: "Ingeniera · Colombia",
  },
  {
    quote:
      "Por fin separé visa de estatus. Dejé de decidir con miedo y empecé a decidir con información de mi propio caso.",
    name: "Luis F.",
    role: "Médico · México",
  },
  {
    quote:
      "Ivon explica sin humo. Entendí D/S, cambio de estatus y qué cambia cuando cambia tu situación. Eso no te lo da un PDF genérico.",
    name: "Camila R.",
    role: "Diseñadora · Perú",
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function WETestimonials() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Lo que dicen quienes ya lo vieron
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] opacity-80" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={item}
              className="flex flex-col rounded-2xl border border-gray-100 bg-[#F4F6FB] p-5 shadow-sm sm:p-6"
            >
              <Quote className="mb-3 h-6 w-6 shrink-0 text-[#F37021]" />
              <blockquote className="flex-1 text-sm leading-relaxed text-navy-deep">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-bold text-navy-deep">{t.name}</p>
                <p className="text-xs font-medium text-[#F37021]">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
