import { motion } from "framer-motion"

export default function TCManifesto() {
  return (
    <section className="bg-paper-warm py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
          Mensaje a la comunidad
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-deep sm:text-4xl">
          Migrar no debería costarte una fortuna.{" "}
          <span className="text-[#F37021]">Y menos esperar a ciegas.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Alguien tenía que decirlo: la mayoría de los errores caros no vienen de elegir mal
          la visa, sino de avanzar sin saber dónde estás parado. Este taller existe para que
          decidas con estrategia, no con rumores ni con prisa.
        </p>
      </motion.div>
    </section>
  )
}
