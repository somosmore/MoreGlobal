import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "Estaba a punto de aplicar con una estrategia de hace tres años. Después de escuchar a Ivon reordené todo el caso antes de presentarlo.",
    name: "Ana M.",
    role: "Ingeniera · Colombia",
  },
  {
    quote:
      "Dejé de leer titulares y empecé a leer fuentes. Entender el panorama me ahorró meses de trámites que no correspondían a mi perfil.",
    name: "Luis F.",
    role: "Médico · México",
  },
  {
    quote:
      "Ivon explica sin humo. Salí con un mapa del sistema, no con una lista de siglas que no entendía.",
    name: "Camila R.",
    role: "Diseñadora · Perú",
  },
]

export default function WSTestimonials() {
  return (
    <section className="bg-white py-14 sm:py-18">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Experiencias reales
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Información que ayuda a tomar mejores decisiones.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col border-t-2 border-orange bg-paper p-6"
            >
              <Quote className="h-5 w-5 text-orange-dark" aria-hidden />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-deep">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-bold text-navy-deep">{testimonial.name}</span>
                <span className="text-ink-muted"> · {testimonial.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
