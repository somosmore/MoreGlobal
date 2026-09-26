import { motion } from "framer-motion"

export default function CMSpeaker() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center sm:flex-row sm:px-6 sm:text-left"
      >
        <img
          src="/ivon.png"
          alt="Ivon More"
          className="h-20 w-20 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">Tu guía</p>
          <h2 className="mt-2 text-xl font-bold text-navy-deep">Ivon More</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Fundadora de MORE y del Instituto More de Educación Migratoria. Comparte
            herramientas para que tomes decisiones informadas sobre tu camino a EE.UU.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
