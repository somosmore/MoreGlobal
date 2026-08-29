import { motion } from "framer-motion"
import { CtaButton } from "@/components/brand/CtaButton"
import { scrollToRegistro } from "./scrollToRegistro"

export default function WSTension() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="font-display text-2xl font-bold leading-tight text-navy-deep sm:text-3xl">
          El error más caro no es elegir mal la visa… es{" "}
          <span className="text-[#F37021]">
            planificar sobre un panorama que ya cambió
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Cada año USCIS y el Departamento de Estado ajustan criterios, tiempos y
          prioridades. La mayoría se entera cuando ya presentó el caso, cuando ya
          pagó, cuando ya perdió meses.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Leer el panorama migratorio{" "}
          <strong className="font-semibold text-navy-deep">antes</strong> de
          decidir no es un lujo: es la diferencia entre avanzar y repetir el
          proceso desde cero.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton
            label="Quiero leer el panorama antes de decidir"
            href="#registro"
            onClick={scrollToRegistro}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
        </div>
      </motion.div>
    </section>
  )
}
