import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle2, CreditCard, MessageCircle } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { TICKETS, buildPaymentUrl, getTicket, getTicketPricing, type TicketType } from "./tallerNov26Copy"
import { usePriceTier } from "./priceTier"

type TCPaymentCardProps = {
  /** Entrada elegida en el formulario. En /registro (Meta Lead Ads) se elige aquí. */
  ticket?: TicketType
  email?: string
  showLogo?: boolean
}

export default function TCPaymentCard({ ticket, email, showLogo = false }: TCPaymentCardProps) {
  const { settings } = useSiteSettings()
  const tier = usePriceTier()
  const [selected, setSelected] = useState<TicketType>(ticket ?? "general")
  const current = getTicket(selected)
  // Con entrada elegida en el form, el selector queda oculto hasta pedir "Cambiar de entrada".
  const [showPicker, setShowPicker] = useState(!ticket)
  const { price, compareAt, link } = getTicketPricing(current, settings, tier)
  const paymentUrl = buildPaymentUrl(link, email)

  const waDigits = settings.whatsapp_number.replace(/\D/g, "")
  const tierNote = tier === "comunidad" ? " con precio de Comunidad More" : ""
  const waUrl = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Hola, me registré en el Taller Comunidad More (entrada ${current.name}${tierNote}) y tengo una consulta.`,
      )}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      {showLogo && (
        <div className="mb-8 flex justify-center">
          <Link to="/" aria-label="MORE — Ir al inicio">
            <img src="/logo_more_dark.png" alt="MORE — Migración con Propósito" className="h-40 w-auto sm:h-48" />
          </Link>
        </div>
      )}

      <div className="rounded-3xl border border-navy/15 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-orange-wash">
          <CheckCircle2 className="h-9 w-9 text-orange-dark" aria-hidden />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
          Embarque · Paso 2 de 2
        </p>
        <h2 className="mt-2 font-sans text-2xl font-extrabold tracking-tight leading-snug text-navy-deep">
          {ticket ? "¡Tus datos están registrados!" : "Completa tu entrada"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Para asegurar tu lugar en el taller del 23 y 24 de noviembre, completa el pago de
          tu entrada.
        </p>

        {showPicker && (
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {TICKETS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelected(t.id)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  selected === t.id ? "border-orange bg-orange-wash" : "border-gray-300 hover:border-orange/50"
                }`}
              >
                <span className="block text-sm font-bold text-navy-deep">{t.name}</span>
                <span className="block text-xs text-ink-muted">
                  {getTicketPricing(t, settings, tier).price || "Precio por confirmar"}
                </span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 rounded-xl bg-paper p-4 text-left">
          <p className="text-xs uppercase tracking-wider text-ink-muted">Entrada</p>
          <p className="mt-1 flex items-baseline justify-between gap-3">
            <span className="text-lg font-bold text-navy-deep">{current.name}</span>
            <span className="text-right">
              {compareAt && (
                <span className="mr-2 text-sm text-ink-muted line-through">{compareAt}</span>
              )}
              <span className="text-base font-semibold text-navy-deep">{price || "Precio por confirmar"}</span>
            </span>
          </p>
          {compareAt && (
            <p className="mt-2 text-xs font-semibold text-orange-dark">Precio exclusivo Comunidad More</p>
          )}
        </div>

        <div className="mt-6">
          {paymentUrl ? (
            <CtaButton
              label={`Pagar entrada ${current.name}`}
              href={paymentUrl}
              size="lg"
              icon={CreditCard}
              className="font-bold"
            />
          ) : (
            <p className="rounded-xl border border-orange/30 bg-orange-wash px-4 py-3 text-sm text-navy-deep">
              El pago en línea se habilita en breve. Te enviaremos el enlace de pago por
              WhatsApp para completar tu entrada.
            </p>
          )}
        </div>

        {!showPicker && (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="mt-4 text-xs font-medium text-ink-muted underline-offset-4 hover:text-navy-deep hover:underline"
          >
            Cambiar de entrada
          </button>
        )}

        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-navy-deep hover:text-orange-dark"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            ¿Dudas? Escríbenos por WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  )
}
