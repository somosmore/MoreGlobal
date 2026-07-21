import { motion } from "framer-motion"
import { Quote } from "lucide-react"

// TODO: reemplazar por testimonios reales antes de publicar.
const testimonials = [
  {
    quote:
      "Estaba a punto de pagarle a un abogado que me prometía la residencia 'segura'. Después del taller me di cuenta de todas las señales que estaba ignorando.",
    name: "María G.",
    role: "Ingeniera · Colombia",
  },
  {
    quote:
      "Me ahorré una fortuna. Aprendí qué preguntas hacer antes de firmar y descubrí que me estaban cobrando por servicios que no necesitaba.",
    name: "Carlos R.",
    role: "Médico · México",
  },
  {
    quote:
      "Ivon habla con una honestidad que no ves en la industria. Salí del taller sabiendo exactamente en qué fijarme.",
    name: "Daniela P.",
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

export default function TNTestimonials() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Lo que dicen quienes ya lo vieron
          </h2>
          <div className="h-1 w-20 mx-auto rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] mt-4 opacity-80" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={item}
              className="flex flex-col rounded-2xl bg-[#F4F6FB] border border-gray-100 shadow-sm p-5 sm:p-6"
            >
              <Quote className="h-6 w-6 text-[#F37021] mb-3 shrink-0" />
              <blockquote className="flex-1 text-sm leading-relaxed text-navy-deep">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 pt-4 border-t border-gray-200">
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
