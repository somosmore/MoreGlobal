import { motion } from "framer-motion"
import { CtaButton } from "@/components/brand/CtaButton"
import { COMUNIDAD_CTA_LABEL } from "./comunidadCopy"
import { scrollToRegistro } from "./scrollToRegistro"

export default function CMFinalCTA() {
  return (
    <section className="bg-navy-deep py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-2xl px-4 text-center sm:px-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-light">
          Comunidad MORE
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Tu próximo paso puede empezar hoy.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
          Entra gratis y recibe información útil para decidir con más criterio.
        </p>
        <div className="mt-8">
          <CtaButton
            label={COMUNIDAD_CTA_LABEL}
            href="#registro"
            onClick={scrollToRegistro}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
          <p className="mt-3 text-xs text-white/60">Gratis · Sin compromiso</p>
        </div>
      </motion.div>
    </section>
  )
}
