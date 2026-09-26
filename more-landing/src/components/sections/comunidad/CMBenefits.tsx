import { motion } from "framer-motion"
import { Bell, Compass, Users } from "lucide-react"

const benefits = [
  {
    icon: Compass,
    title: "Entiende tus opciones",
    text: "Información clara para evaluar tu siguiente paso migratorio.",
  },
  {
    icon: Bell,
    title: "Entérate primero",
    text: "Recibe avisos de lives, recursos y próximas masterclasses.",
  },
  {
    icon: Users,
    title: "Avanza acompañado",
    text: "Conecta con profesionales que también miran hacia Estados Unidos.",
  },
]

export default function CMBenefits() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Lo que encuentras dentro
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Menos ruido. Más claridad para decidir.
          </h2>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-navy/10 bg-navy/10 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="bg-white p-7 sm:p-8"
            >
              <Icon className="h-5 w-5 text-orange-dark" aria-hidden />
              <h3 className="mt-5 text-lg font-bold text-navy-deep">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
