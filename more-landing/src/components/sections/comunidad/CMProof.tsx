import { motion } from "framer-motion"
import { Quote } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { COMUNIDAD_CTA_LABEL } from "./comunidadCopy"
import { scrollToRegistro } from "./scrollToRegistro"

// Cifras ya publicadas en el home (translation.json → hero.socialProof / approvalRate).
const stats = [
  { value: "+200", label: "Profesionales con Green Card aprobada" },
  { value: "98%", label: "Tasa de aprobación" },
  { value: "EB-2 NIW", label: "Especialistas, sin oferta de empleo" },
]

export default function CMProof() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-2xl font-bold text-navy-deep sm:text-3xl"
        >
          Resultados que respaldan lo que compartimos
        </motion.h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] opacity-80" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-navy/10 bg-[#F4F6FB] p-6 text-center"
            >
              <p className="font-display text-3xl font-bold text-[#F37021] sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium text-navy-deep">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* TODO: validar la frase con Ivon (redactada como propuesta, no es una cita textual). */}
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 max-w-2xl text-center"
        >
          <Quote className="mx-auto mb-4 h-8 w-8 text-[#F37021]" aria-hidden />
          <blockquote className="font-display text-xl font-semibold leading-snug text-navy-deep sm:text-2xl">
            “Migrar bien no depende de la suerte. Depende de tener información
            correcta, criterio para usarla y personas que ya recorrieron el camino
            a tu lado.”
          </blockquote>
          <figcaption className="mt-4 text-sm font-semibold text-orange-dark">
            — Ivon More
          </figcaption>
        </motion.figure>

        <div className="mt-10 flex justify-center">
          <CtaButton
            label={COMUNIDAD_CTA_LABEL}
            href="#registro"
            onClick={scrollToRegistro}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
        </div>
      </div>
    </section>
  )
}
