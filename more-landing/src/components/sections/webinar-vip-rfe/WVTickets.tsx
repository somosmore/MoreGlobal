import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { cn } from "@/lib/utils"
import { WV_TICKETS } from "./webinarVipRfeCopy"
import { scrollToRegistro } from "./scrollToRegistro"

/** Las dos entradas con su precio (de Configuración) y qué incluye cada una. */
export default function WVTickets() {
  const { settings } = useSiteSettings()

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">Entradas</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-sans text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
          Elige tu entrada
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-muted">
          Precio exclusivo de la Comunidad More. Todo lo que incluye cada una, por escrito y antes de pagar.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {WV_TICKETS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={cn(
                "flex flex-col rounded-3xl border bg-white p-6 shadow-sm sm:p-8",
                t.highlighted ? "border-2 border-orange" : "border-navy/15",
              )}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-dark">
                Entrada {t.name}
                {t.highlighted ? " · Recomendada" : ""}
              </p>
              <p className="mt-3 text-3xl font-extrabold text-navy-deep">
                {settings[t.priceKey] || "Precio por confirmar"}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{t.tagline}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {t.includes.map((x) => (
                  <li key={x} className="flex gap-2 text-sm leading-relaxed text-navy-deep">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={(e) => scrollToRegistro(e, t.id)}
                className={cn(
                  "mt-6 h-12 w-full rounded-full text-sm font-bold transition-colors",
                  t.highlighted
                    ? "bg-orange text-white hover:bg-orange-dark"
                    : "border border-navy/20 text-navy-deep hover:border-orange hover:text-orange-dark",
                )}
              >
                Reservar {t.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
