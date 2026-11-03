import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { MODULES, PAINS } from "./tallerNov26Copy"
import { useSelectedPains } from "./painsStore"
import { DotGrid } from "./TCDecor"

/**
 * Los 5 módulos como paradas de una ruta vertical que se dibuja con el scroll.
 * Las paradas que resuelven los dolores marcados arriba se resaltan.
 */
export default function TCModules() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const selected = useSelectedPains()
  const painsByModule = (id: number) => PAINS.filter((p) => p.moduleId === id && selected.has(p.id))

  return (
    <section id="ruta" className="relative isolate scroll-mt-4 overflow-hidden bg-navy-ink py-16 text-white sm:py-24">
      <DotGrid />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">La ruta del taller</p>
          <h2 className="mt-3 font-sans text-3xl font-extrabold tracking-tight sm:text-4xl">
            Sales con una ruta, <span className="text-orange">no con dudas.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-navy-pale">
            Cinco paradas, del punto donde estás hoy a un plan de acción concreto.
          </p>
        </motion.div>

        <ol ref={ref} className="relative mt-12">
          {/* Riel punteado de fondo + tramo naranja que avanza con el scroll */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[19px] top-6 w-0 border-l-2 border-dotted border-navy-line sm:left-[23px]"
          />
          <motion.span
            aria-hidden
            style={{ scaleY: progress }}
            className="absolute bottom-6 left-[18px] top-6 w-[3px] origin-top rounded-full bg-orange sm:left-[22px]"
          />

          {MODULES.map((mod, index) => {
            const hits = painsByModule(mod.id)
            const highlighted = hits.length > 0
            const isLast = index === MODULES.length - 1
            return (
              <motion.li
                key={mod.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.4 }}
                className="relative flex gap-5 pb-8 last:pb-0 sm:gap-7"
              >
                <span
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold sm:h-12 sm:w-12",
                    isLast
                      ? "border-orange bg-orange text-white"
                      : highlighted
                        ? "border-orange bg-navy-ink text-orange"
                        : "border-navy-line bg-navy-ink text-navy-pale",
                  )}
                >
                  {isLast ? <Plane className="h-5 w-5" aria-hidden /> : String(mod.id).padStart(2, "0")}
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-2xl border p-5 transition-colors sm:p-6",
                    highlighted ? "border-orange/60 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold sm:text-xl">{mod.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-soft">
                      Parada {mod.id} de {MODULES.length}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-navy-pale">{mod.text}</p>
                  {highlighted && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold text-orange-light">
                      Resuelve: “{hits.map((h) => h.quote.replace(/[.?¿]/g, "")).join("” · “")}”
                    </p>
                  )}
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
