import { motion } from "framer-motion"
import { CtaButton } from "@/components/brand/CtaButton"
import { TALLER_CTA_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"

export default function TCFinalCTA() {
  return (
    <section className="bg-navy-deep py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Sin estrategia, <span className="text-[#F37021]">cada paso cuesta más.</span>
        </h2>
        <p className="mt-4 text-base text-white/75">
          Asegura tu lugar en el Taller Comunidad More · Lunes 23 de noviembre, 7:00 PM (Colombia).
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton
            label={TALLER_CTA_LABEL}
            href="#entradas"
            onClick={scrollToEntradas}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
        </div>
      </motion.div>
    </section>
  )
}
