import { motion } from "framer-motion"
import { FEARS } from "./tallerNov26Copy"
import { DotGrid } from "./TCDecor"

/** Los 3 miedos que más frenan la decisión, respondidos sin prometer resultados. */
export default function TCFears() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-ink py-16 text-white sm:py-24">
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
            Lo que nadie te aclara
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Los miedos que frenan a casi todos. <span className="text-orange">Los resolvemos en vivo.</span>
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FEARS.map((fear, index) => (
            <motion.div
              key={fear.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <span className="font-mono text-xs font-bold text-orange">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-bold leading-snug">{fear.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-pale">{fear.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
