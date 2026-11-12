import { useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { CalendarPlus, CheckCircle2, Download, Mail, MessageCircle, Plane, Users } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { trackWorkshopPurchase } from "@/lib/tracking"
import { COMUNIDAD_FACEBOOK_GROUP_URL } from "@/components/sections/comunidad/CMFacebookJoinCard"
import {
  TICKETS,
  getTicketPricing,
  parsePriceAmount,
  type PriceTier,
  type TicketType,
} from "@/components/sections/taller-nov-26/tallerNov26Copy"
import { downloadIcs, googleCalendarLinks } from "@/components/sections/taller-nov-26/tallerCalendar"
import { DotGrid, FlightRoute } from "@/components/sections/taller-nov-26/TCDecor"

/**
 * Página a la que redirige Stripe después del pago:
 * /taller-23nov/gracias?entrada=general|vip&version=publico|comunidad&session_id={CHECKOUT_SESSION_ID}
 * Confirma la compra, dispara Purchase (una vez por pago) y muestra los siguientes pasos.
 */
export default function TallerNov26GraciasPage() {
  const [params] = useSearchParams()
  const { settings, loading } = useSiteSettings()

  const ticketId: TicketType = params.get("entrada") === "vip" ? "vip" : "general"
  const tier: PriceTier = params.get("version") === "comunidad" ? "comunidad" : "publico"
  const sessionId = params.get("session_id")?.trim() ?? ""
  const ticket = TICKETS.find((t) => t.id === ticketId) ?? TICKETS[0]
  const { price } = getTicketPricing(ticket, settings, tier)
  const calendar = useMemo(() => googleCalendarLinks(), [])

  // Meta / GA4: compra real solo si viene de Stripe (session_id) y con precios cargados.
  useEffect(() => {
    if (loading || !sessionId || sessionId.includes("{")) return
    const value = parsePriceAmount(price)
    if (value === null) return
    void trackWorkshopPurchase(settings, { value, currency: "USD", eventId: sessionId })
  }, [loading, sessionId, price, settings])

  useEffect(() => {
    const previousTitle = document.title
    document.title = "¡Tu lugar está confirmado! — Taller MORE 23 y 24 de noviembre"
    const robots = document.createElement("meta")
    robots.setAttribute("name", "robots")
    robots.setAttribute("content", "noindex, nofollow")
    document.head.appendChild(robots)
    return () => {
      robots.remove()
      document.title = previousTitle
    }
  }, [])

  const waDigits = settings.whatsapp_number.replace(/\D/g, "")
  const waUrl = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Hola, acabo de pagar mi entrada ${ticket.name} al Taller MORE del 23 y 24 de noviembre y tengo una consulta.`,
      )}`
    : null

  const steps = [
    {
      icon: Mail,
      title: "Revisa tu correo y WhatsApp",
      text: "Antes del taller te enviamos el acceso a Zoom. Guarda nuestro número para no perderte ningún aviso.",
    },
    ...(ticket.id === "vip"
      ? [
          {
            icon: CheckCircle2,
            title: "Revisión de tu perfil (VIP)",
            text: "Te escribimos para coordinar la revisión de tu perfil o expediente con el equipo de MORE.",
          },
        ]
      : []),
    {
      icon: Users,
      title: "Únete a la Comunidad More",
      text: "Contenido de Ivon More, lives de preguntas y los avisos de las próximas masterclasses.",
    },
  ]

  return (
    <div className="campaign-editorial relative isolate min-h-[100dvh] overflow-hidden bg-navy-ink text-white">
      <DotGrid />
      <FlightRoute className="absolute inset-x-0 top-4 opacity-70" duration={9} />

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange">
            <CheckCircle2 className="h-9 w-9 text-white" aria-hidden />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange">Pago recibido</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            ¡Tu lugar está <span className="text-orange">confirmado!</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-navy-pale">
            Nos vemos el lunes 23 y el martes 24 de noviembre a las 7:00 PM (hora Colombia), en vivo con Ivon More.
          </p>
        </motion.div>

        {/* Pase de abordar confirmado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 rounded-3xl bg-white p-6 text-navy-deep shadow-xl sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
            <span className="text-ink-muted">Pase de abordar · MORE 2311</span>
            <span className="rounded-full bg-green-600 px-3 py-1 text-white">Confirmado</span>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <p className="text-3xl font-extrabold leading-none tracking-tight">HOY</p>
            <div className="flex flex-1 items-center gap-2 text-orange" aria-hidden>
              <span className="flex-1 border-t-2 border-dotted border-navy-line" />
              <Plane className="h-5 w-5" />
              <span className="flex-1 border-t-2 border-dotted border-navy-line" />
            </div>
            <p className="text-3xl font-extrabold leading-none tracking-tight text-orange">EE.UU.</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-navy/10 pt-5 sm:grid-cols-4">
            {[
              { label: "Entrada", value: ticket.name },
              { label: "Fechas", value: "23 y 24 NOV" },
              { label: "Hora", value: "19:00 COT" },
              { label: "Puerta", value: "Zoom" },
            ].map((d) => (
              <div key={d.label}>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{d.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold">{d.value}</dd>
              </div>
            ))}
          </dl>
          {tier === "comunidad" && (
            <p className="mt-4 text-xs font-semibold text-orange-dark">Precio exclusivo Comunidad More</p>
          )}
        </motion.div>

        {/* Calendario */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="flex items-center gap-2 text-sm font-bold">
            <CalendarPlus className="h-4 w-4 text-orange" aria-hidden /> Agrega el taller a tu calendario
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {calendar.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-orange px-4 py-2 text-sm font-bold text-white hover:bg-orange-dark"
              >
                Google Calendar · {c.label}
              </a>
            ))}
            <button
              type="button"
              onClick={downloadIcs}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold hover:border-white/50"
            >
              <Download className="h-4 w-4" aria-hidden /> Apple / Outlook (.ics)
            </button>
          </div>
        </div>

        {/* Siguientes pasos */}
        <ol className="mt-8 space-y-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-orange font-mono text-sm font-bold text-orange">
                {i + 1}
              </span>
              <div>
                <p className="flex items-center gap-2 font-bold">
                  <Icon className="h-4 w-4 text-orange" aria-hidden /> {title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-navy-pale">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center gap-4">
          <a
            href={COMUNIDAD_FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#1877F2] px-8 text-sm font-bold text-white hover:bg-[#0F66D9]"
          >
            <Users className="h-4 w-4" aria-hidden /> Entrar a la Comunidad More
          </a>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy-pale hover:text-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> ¿Dudas? Escríbenos por WhatsApp
            </a>
          )}
          <Link to="/" className="text-xs text-navy-soft underline-offset-4 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
