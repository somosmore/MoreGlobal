import { motion } from "framer-motion"
import { CheckCircle2, FileCheck2 } from "lucide-react"
import { WV_BLOCKS, WV_INCLUDES } from "./webinarVipRfeCopy"

/** Los cuatro bloques como una línea de tiempo de tu proceso, y qué incluye la entrada. */
export default function WVAgenda() {
  return (
    <section className="bg-paper py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
          Qué vemos en vivo
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-sans text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
          Una respuesta para cada etapa de tu proceso
        </h2>

        <ol className="relative mt-10 space-y-5 border-l-2 border-orange/30 pl-6 sm:pl-8">
          {WV_BLOCKS.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative rounded-2xl border border-navy/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <span
                className="absolute -left-[2.15rem] top-6 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-xs font-bold text-white sm:-left-[2.65rem]"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-dark">{b.stage}</p>
              <h3 className="mt-1 text-lg font-bold text-navy-deep sm:text-xl">{b.title}</h3>
              <p className="mt-1 text-sm italic text-ink-muted">“{b.question}”</p>
              <ul className="mt-3 space-y-1.5">
                {b.points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm leading-relaxed text-navy-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl bg-navy-ink p-6 text-white sm:p-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-orange">
            <FileCheck2 className="h-4 w-4" aria-hidden />
            Tu entrada incluye
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {WV_INCLUDES.map((x) => (
              <li key={x} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-snug">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
