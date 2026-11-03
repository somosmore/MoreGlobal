import { motion } from "framer-motion"

const modules = [
  {
    title: "Dónde estás hoy",
    text: "Tu punto de partida real: perfil, estatus y opciones. Para dejar de adivinar por dónde empezar.",
  },
  {
    title: "Qué ruta te conviene",
    text: "Los caminos más comunes —para profesionales, empresarios y quienes ya están en EE.UU.— y cuál encaja contigo.",
  },
  {
    title: "Cómo demostrar tu experiencia",
    text: "Qué hacer cuando la empresa ya cerró, el jefe no está o el certificado no dice tus funciones. El obstáculo número uno, resuelto con método.",
  },
  {
    title: "El costo real, sin sorpresas",
    text: "Dónde se va el dinero: tasas, traducciones, equivalencias. Y cómo evitar los errores que más cuestan.",
  },
  {
    title: "Tu plan de acción",
    text: "Pasos concretos para empezar la próxima semana, con estrategia y en el orden correcto.",
  },
]

export default function TCModules() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Lo que aprenderás
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Sales con una ruta, <span className="text-[#F37021]">no con dudas.</span>
          </h2>
        </motion.div>

        <ol className="mt-10 space-y-3">
          {modules.map(({ title, text }, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="flex gap-5 border border-navy/10 bg-paper p-5 sm:p-6"
            >
              <span className="font-display text-3xl font-bold leading-none text-[#F37021] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-bold text-navy-deep sm:text-lg">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
