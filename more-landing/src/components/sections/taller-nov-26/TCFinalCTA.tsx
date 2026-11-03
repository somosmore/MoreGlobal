import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { TALLER_CTA_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"
import { DotGrid, FlightRoute } from "./TCDecor"

export default function TCFinalCTA() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-ink py-20 text-white sm:py-28">
      <DotGrid />
      <FlightRoute className="absolute inset-x-0 bottom-6 opacity-70" duration={13} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">Última llamada a bordo</p>
        <h2 className="mt-4 font-sans text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl">
          Sin estrategia, <span className="text-orange">cada paso cuesta más.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-navy-pale sm:text-lg">
          Lunes 23 de noviembre · 7:00 PM (Colombia) · Virtual y en vivo con Ivon More.
        </p>
        <div className="mt-10 flex justify-center">
          <CtaButton
            label={TALLER_CTA_LABEL}
            href="#entradas"
            onClick={scrollToEntradas}
            size="lg"
            icon={ArrowRight}
            className="w-auto flex-row-reverse font-bold"
          />
        </div>
      </motion.div>
    </section>
  )
}
