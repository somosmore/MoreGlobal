import { motion } from "framer-motion"
import { Check, ShieldCheck } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { cn } from "@/lib/utils"
import { TICKETS } from "./tallerNov26Copy"
import { scrollToRegistro } from "./scrollToRegistro"

export default function TCTickets() {
  const { settings, loading } = useSiteSettings()

  return (
    <section id="entradas" className="scroll-mt-6 bg-paper-warm py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Tu entrada
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Elige tu entrada
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Precio especial para la Comunidad More. Taller virtual: lo ves desde donde estés.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {TICKETS.map((ticket, index) => {
            const price = settings[ticket.priceKey].trim()
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className={cn(
                  "relative flex flex-col bg-white p-6 sm:p-8",
                  ticket.highlighted ? "border-2 border-orange shadow-lg" : "border border-navy/15",
                )}
              >
                {ticket.highlighted && (
                  <span className="absolute -top-3 left-6 bg-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                    Más completo
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-navy-deep">{ticket.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{ticket.tagline}</p>

                <p className="mt-6 font-display text-3xl font-bold text-navy-deep">
                  {loading ? (
                    <span className="inline-block h-8 w-36 animate-pulse rounded bg-gray-200" />
                  ) : price ? (
                    price
                  ) : (
                    <span className="text-xl text-ink-muted">Precio por confirmar</span>
                  )}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {ticket.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-deep">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-dark" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <CtaButton
                  label={`Reservar ${ticket.name}`}
                  href="#registro"
                  onClick={(e) => scrollToRegistro(e, ticket.id)}
                  variant={ticket.highlighted ? "primary" : "secondary"}
                  size="lg"
                  icon={null}
                  className="mt-8 font-bold"
                />
              </motion.div>
            )
          })}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-muted">
          <ShieldCheck className="h-4 w-4 text-orange-dark" aria-hidden />
          Cupos limitados · Pago seguro
        </p>
      </div>
    </section>
  )
}
