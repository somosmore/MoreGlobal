import { motion } from "framer-motion"
import { Check, Plane, ShieldCheck } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { cn } from "@/lib/utils"
import { GUARANTEES, TICKETS } from "./tallerNov26Copy"
import { scrollToRegistro } from "./scrollToRegistro"

const passDetails = [
  { label: "Pasajero", value: "Tú" },
  { label: "Fecha", value: "23 NOV" },
  { label: "Hora", value: "19:00 COT" },
  { label: "Puerta", value: "En línea" },
]

/** Código de barras decorativo del talón. */
function Barcode({ dark }: { dark: boolean }) {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2]
  return (
    <div aria-hidden className="flex h-10 items-stretch gap-[2px] opacity-70">
      {bars.map((w, i) => (
        <span key={i} style={{ width: w }} className={dark ? "bg-white/80" : "bg-navy-deep"} />
      ))}
    </div>
  )
}

export default function TCTickets() {
  const { settings, loading } = useSiteSettings()

  return (
    <section id="entradas" className="scroll-mt-4 bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-dark">Tu entrada</p>
          <h2 className="mt-3 font-sans text-3xl font-extrabold tracking-tight text-navy-deep sm:text-4xl">
            Elige tu <span className="text-orange">pase de abordar</span>
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Precio especial para la Comunidad More. Taller virtual: lo ves desde donde estés.
          </p>
        </motion.div>

        <div className="mt-12 space-y-8">
          {TICKETS.map((ticket, index) => {
            const price = settings[ticket.priceKey].trim()
            const dark = Boolean(ticket.highlighted)
            return (
              <motion.article
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className={cn(
                  "relative flex flex-col overflow-hidden rounded-3xl md:flex-row",
                  dark ? "bg-navy-ink text-white shadow-xl" : "border border-navy/15 bg-white text-navy-deep shadow-sm",
                )}
              >
                {/* Cuerpo del pase */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-[11px] font-bold uppercase tracking-[0.18em]",
                        dark ? "text-navy-soft" : "text-ink-muted",
                      )}
                    >
                      Pase de abordar · MORE 2311
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                        dark ? "bg-orange text-white" : "bg-navy-deep text-white",
                      )}
                    >
                      Clase {ticket.name}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div>
                      <p className="font-sans text-4xl font-extrabold tracking-tight leading-none">HOY</p>
                      <p className={cn("mt-1 text-xs", dark ? "text-navy-soft" : "text-ink-muted")}>Tu punto de partida</p>
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-orange" aria-hidden>
                      <span className="flex-1 border-t-2 border-dotted border-navy-line" />
                      <Plane className="h-5 w-5" />
                      <span className="flex-1 border-t-2 border-dotted border-navy-line" />
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-4xl font-extrabold tracking-tight leading-none text-orange">EE.UU.</p>
                      <p className={cn("mt-1 text-xs", dark ? "text-navy-soft" : "text-ink-muted")}>Tu ruta clara</p>
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {passDetails.map(({ label, value }) => (
                      <div key={label}>
                        <dt className={cn("text-[10px] font-bold uppercase tracking-[0.16em]", dark ? "text-navy-soft" : "text-ink-muted")}>
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <ul className={cn("mt-6 grid gap-2 border-t pt-5 sm:grid-cols-2", dark ? "border-white/10" : "border-navy/10")}>
                    {ticket.includes.map((item) => (
                      <li key={item} className="flex gap-2 text-sm leading-relaxed">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Perforación (vertical en desktop, horizontal en mobile) */}
                <div aria-hidden className="relative md:w-0">
                  <span
                    className={cn(
                      "absolute inset-x-6 top-0 border-t-2 border-dashed md:inset-x-auto md:inset-y-6 md:left-0 md:border-l-2 md:border-t-0",
                      dark ? "border-white/20" : "border-navy/15",
                    )}
                  />
                  <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-paper md:-top-3 md:left-auto md:-translate-x-1/2" />
                  <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-paper md:-bottom-3 md:right-auto md:top-auto md:-translate-x-1/2" />
                </div>

                {/* Talón */}
                <div className="flex flex-col justify-between gap-5 p-6 sm:p-8 md:w-72">
                  <div>
                    <p className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", dark ? "text-navy-soft" : "text-ink-muted")}>
                      Precio
                    </p>
                    <p className="mt-1 font-sans text-3xl font-extrabold tracking-tight">
                      {loading ? (
                        <span className="inline-block h-8 w-32 animate-pulse rounded bg-gray-300/40" />
                      ) : (
                        price || <span className="text-lg font-semibold opacity-70">Precio por confirmar</span>
                      )}
                    </p>
                  </div>
                  <Barcode dark={dark} />
                  <button
                    type="button"
                    onClick={(e) => scrollToRegistro(e, ticket.id)}
                    className="cta-shine flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-orange px-6 text-base font-bold text-white shadow-md shadow-orange/25 hover:bg-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                  >
                    Reservar {ticket.name}
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Compromisos operativos: responden a talleres pospuestos y grabaciones que no llegaban */}
        <div className="mt-10 rounded-3xl border border-navy/10 bg-white p-6 sm:p-8">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy-deep">
            <ShieldCheck className="h-4 w-4 text-orange" aria-hidden />
            Nuestro compromiso contigo
          </p>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((g) => (
              <div key={g.title}>
                <dt className="text-sm font-bold text-navy-deep">{g.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{g.text}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-navy/10 pt-4 text-xs text-ink-muted">
            Pago seguro · Recibes el acceso por correo y WhatsApp.
          </p>
        </div>
      </div>
    </section>
  )
}
