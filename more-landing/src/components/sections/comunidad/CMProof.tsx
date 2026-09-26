import { motion } from "framer-motion"

const stats = [
  { value: "+200", label: "Profesionales con Green Card aprobada" },
  { value: "98%", label: "Tasa de aprobación" },
  { value: "EB-2 NIW", label: "Especialistas, sin oferta de empleo" },
]

export default function CMProof() {
  return (
    <section className="border-y border-navy/10 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            MORE en números
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Una comunidad guiada por experiencia real.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 divide-y divide-navy/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="px-6 py-6 text-center"
            >
              <p className="font-display text-3xl font-bold text-orange-dark sm:text-4xl">
                {stat.value}
              </p>
              <p className="mx-auto mt-2 max-w-48 text-sm leading-snug text-ink-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
