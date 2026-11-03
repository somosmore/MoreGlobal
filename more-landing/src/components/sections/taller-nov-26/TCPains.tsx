import { motion } from "framer-motion"
import { Compass, FileSearch, Lock, TrendingDown, Wallet } from "lucide-react"

const pains = [
  {
    icon: Compass,
    quote: "No sé por dónde empezar.",
    text: "Demasiada información, consejos contradictorios y rumores de redes. Cada fuente dice algo distinto.",
  },
  {
    icon: Lock,
    quote: "Tengo todo, menos la visa.",
    text: "Ofertas que piden residencia permanente, rechazos por necesitar sponsor, depender de un empleador para quedarte.",
  },
  {
    icon: TrendingDown,
    quote: "Llegué a un tope.",
    text: "Techo profesional y económico en tu país, y miedo a llegar a EE.UU. a empezar de cero o como subcalificado.",
  },
  {
    icon: FileSearch,
    quote: "Mi experiencia es real, pero no tengo cómo probarla.",
    text: "Empresas que cerraron, jefes que ya no están, certificados sin funciones, cartas que nadie quiere firmar.",
  },
  {
    icon: Wallet,
    quote: "¿Cuánto me va a costar realmente?",
    text: "El total, los costos ocultos —tasas, traducciones, equivalencias— y el miedo a endeudarte por un proceso incierto.",
  },
]

export default function TCPains() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            ¿Te suena alguna de estas?
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Son las frases que más escuchamos de profesionales como tú.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pains.map(({ icon: Icon, quote, text }, index) => (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="flex flex-col border-t-2 border-orange bg-paper p-6"
            >
              <Icon className="h-5 w-5 text-orange-dark" aria-hidden />
              <p className="mt-4 font-display text-lg font-bold leading-snug text-navy-deep">
                “{quote}”
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="flex flex-col justify-center bg-navy-deep p-6 text-center sm:col-span-2 lg:col-span-1"
          >
            <p className="font-display text-xl font-bold leading-snug text-white">
              Sin estrategia, <span className="text-[#F37021]">cada paso cuesta más.</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              En este taller ordenamos todo eso en una ruta clara para tu perfil.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
