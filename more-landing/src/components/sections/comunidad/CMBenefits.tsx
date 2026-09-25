import { motion } from "framer-motion"
import { Sparkles, Video, GraduationCap, MessageCircleQuestion, Users } from "lucide-react"

const benefits = [
  {
    icon: Video,
    title: "Contenido de Ivon More",
    text: "Explicaciones claras sobre visas, tiempos de USCIS y rutas migratorias para profesionales, sin tecnicismos ni rumores.",
  },
  {
    icon: GraduationCap,
    title: "Acceso prioritario a masterclasses",
    text: "Eres de los primeros en enterarte y reservar tu lugar en las masterclasses gratuitas del Instituto More.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Lives de preguntas y respuestas",
    text: "Espacios en vivo donde el equipo de MORE responde las dudas que más se repiten en la comunidad.",
  },
  {
    icon: Users,
    title: "Red de profesionales",
    text: "Conecta con ingenieros, médicos, emprendedores y otros profesionales que están planificando el mismo camino.",
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

export default function CMBenefits() {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-4xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={container}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-[#F37021]" />
          <h2 className="text-center font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Esto es lo que recibes gratis en la comunidad
          </h2>
          <Sparkles className="h-5 w-5 text-[#F37021]" />
        </div>

        <div className="mx-auto mb-8 h-1 w-20 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] opacity-80" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              variants={item}
              className="flex items-start gap-4 rounded-xl border border-navy/10 bg-[#F4F6FB] p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-wash">
                <Icon className="h-5 w-5 text-orange-dark" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-deep sm:text-lg">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
