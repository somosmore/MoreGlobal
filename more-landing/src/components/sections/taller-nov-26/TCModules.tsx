import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { MODULES, MODULES_DAY2, PAINS, TALLER_DAYS } from "./tallerNov26Copy"
import { useSelectedPains } from "./painsStore"
import { DotGrid } from "./TCDecor"

type Stop = { day: 1 | 2; id: number; title: string; text: string; total: number }
type RouteItem = { kind: "day"; day: (typeof TALLER_DAYS)[number] } | ({ kind: "stop" } & Stop)

const ROUTE: RouteItem[] = [
  { kind: "day", day: TALLER_DAYS[0] },
  ...MODULES.map((m) => ({ kind: "stop" as const, day: 1 as const, total: MODULES.length, ...m })),
  { kind: "day", day: TALLER_DAYS[1] },
  ...MODULES_DAY2.map((m) => ({ kind: "stop" as const, day: 2 as const, total: MODULES_DAY2.length, ...m })),
]

/**
 * La ruta del taller en dos tramos (Día 1 y Día 2), como paradas de una línea
 * que se dibuja con el scroll. Las paradas que resuelven los dolores marcados
 * arriba se resaltan en su día.
 */
export default function TCModules() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const selected = useSelectedPains()
  const painsFor = (day: number, id: number) =>
    PAINS.filter((p) => p.day === day && p.moduleId === id && selected.has(p.id))
  const lastIndex = ROUTE.length - 1

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
            Dos tramos: el lunes diseñas tu ruta, el martes destrabas tu proceso. Puedes tomar uno o los dos.
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

          {ROUTE.map((item, index) => {
            if (item.kind === "day") {
              return (
                <motion.li
                  key={`day-${item.day.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={cn("relative flex items-center gap-5 pb-6 sm:gap-7", index > 0 && "pt-6")}
                >
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange text-sm font-extrabold text-white sm:h-12 sm:w-12">
                    D{item.day.id}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
                      Día {item.day.id} · {item.day.short} · 19:00 COT
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight">{item.day.title}</p>
                    <p className="text-sm text-navy-pale">{item.day.forWho}</p>
                  </div>
                </motion.li>
              )
            }

            const hits = painsFor(item.day, item.id)
            const highlighted = hits.length > 0
            const isLast = index === lastIndex
            return (
              <motion.li
                key={`${item.day}-${item.id}`}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.4 }}
                className="relative flex gap-5 pb-6 last:pb-0 sm:gap-7"
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
                  {isLast ? <Plane className="h-5 w-5" aria-hidden /> : String(item.id).padStart(2, "0")}
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-2xl border p-5 transition-colors sm:p-6",
                    highlighted ? "border-orange/60 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-bold sm:text-xl">{item.title}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-soft">
                      Día {item.day} · Parada {item.id} de {item.total}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-navy-pale">{item.text}</p>
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
