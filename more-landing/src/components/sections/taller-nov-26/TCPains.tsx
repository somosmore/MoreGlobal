import { motion, AnimatePresence } from "framer-motion"
import { ArrowDown, Check, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { MODULES, PAINS } from "./tallerNov26Copy"
import { togglePain, useSelectedPains } from "./painsStore"

/**
 * "¿Qué te pasa hoy?": el visitante marca sus dolores y ve en vivo en qué
 * parada de la ruta se resuelve cada uno. Convierte la lectura en diagnóstico.
 */
export default function TCPains() {
  const selected = useSelectedPains()
  const matched = PAINS.filter((p) => selected.has(p.id))
  const moduleIds = [...new Set(matched.map((p) => p.moduleId))].sort()

  return (
    <section className="relative bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark">
            Diagnóstico rápido
          </p>
          <h2 className="mt-3 font-sans text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            ¿Qué te pasa <span className="text-orange">hoy</span>?
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Toca las frases que sientes como tuyas. Te mostramos dónde las resolvemos.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {PAINS.map((pain, index) => {
            const isOn = selected.has(pain.id)
            return (
              <motion.button
                key={pain.id}
                type="button"
                aria-pressed={isOn}
                onClick={() => togglePain(pain.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
                  isOn
                    ? "border-orange bg-white shadow-md"
                    : "border-navy/10 bg-white hover:border-navy/25",
                  index === PAINS.length - 1 && "sm:col-span-2 sm:mx-auto sm:w-1/2",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isOn ? "border-orange bg-orange text-white" : "border-navy/20 text-transparent group-hover:border-navy/40",
                  )}
                  aria-hidden
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span>
                  <span className="block font-sans text-lg font-extrabold tracking-tight leading-snug text-navy-deep">
                    “{pain.quote}”
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{pain.text}</span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-8 min-h-[7rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            {moduleIds.length > 0 ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="rounded-2xl bg-navy-ink p-6 text-white sm:p-8"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
                  Tu ruta en el taller
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {moduleIds.map((id) => {
                    const mod = MODULES.find((m) => m.id === id)!
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm"
                      >
                        <MapPin className="h-3.5 w-3.5 text-orange" aria-hidden />
                        <span className="font-mono text-navy-soft">{String(id).padStart(2, "0")}</span>
                        {mod.title}
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-4 text-sm text-navy-pale">
                  {matched.length === PAINS.length
                    ? "Te pasa todo lo que más escuchamos. El taller está hecho exactamente para ti."
                    : `Lo trabajamos en ${moduleIds.length === 1 ? "esta parada" : "estas paradas"} de la ruta.`}
                </p>
                <button
                  type="button"
                  onClick={() => document.getElementById("ruta")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy-ink"
                >
                  Ver mi ruta
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="manifesto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-2xl pt-4 text-center"
              >
                <p className="font-sans text-2xl font-extrabold tracking-tight leading-snug text-navy-deep sm:text-3xl">
                  Migrar no debería costarte una fortuna.{" "}
                  <span className="text-orange">Y menos esperar a ciegas.</span>
                </p>
                <p className="mt-3 text-sm text-ink-muted">
                  Sin estrategia, cada paso cuesta más. Este taller existe para que decidas con
                  criterio, no con rumores ni con prisa.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
