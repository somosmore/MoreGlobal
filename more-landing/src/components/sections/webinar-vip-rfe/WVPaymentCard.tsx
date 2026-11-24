import { motion } from "framer-motion"
import { CheckCircle2, CreditCard, MessageCircle } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { eventDateParts } from "./webinarVipRfeCopy"

/** Paso 2 de 2: pagar la entrada (precio y link desde Admin → Configuración → Webinar VIP). */
export default function WVPaymentCard({ email }: { email?: string }) {
  const { settings } = useSiteSettings()
  const link = settings.wv_payment_link.trim()
  const paymentUrl = /^https?:\/\//i.test(link) ? link : null
  const fecha = eventDateParts(settings.wv_event_date)

  const waDigits = settings.whatsapp_number.replace(/\D/g, "")
  const waUrl = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Hola, me registré en el Webinar VIP${email ? ` (${email})` : ""} y tengo una consulta.`,
      )}`
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-3xl border border-navy/15 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-orange-wash">
          <CheckCircle2 className="h-9 w-9 text-orange-dark" aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-dark">Paso 2 de 2</p>
        <h2 className="mt-2 font-sans text-2xl font-extrabold leading-snug tracking-tight text-navy-deep">
          ¡Tus datos están registrados!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Para asegurar tu lugar{fecha ? ` el ${fecha.day} a las ${fecha.time} (Colombia)` : ""}, completa el pago
          de tu entrada. El enlace de acceso te llega por correo y WhatsApp.
        </p>

        <div className="mt-6 flex items-baseline justify-between gap-3 rounded-xl bg-paper p-4 text-left">
          <span>
            <span className="block text-xs uppercase tracking-wider text-ink-muted">Entrada</span>
            <span className="mt-1 block text-lg font-bold text-navy-deep">Webinar VIP</span>
          </span>
          <span className="text-base font-semibold text-navy-deep">{settings.wv_price || "Precio por confirmar"}</span>
        </div>

        <div className="mt-6">
          {paymentUrl ? (
            <CtaButton label="Pagar mi entrada" href={paymentUrl} size="lg" icon={CreditCard} className="font-bold" />
          ) : (
            <p className="rounded-xl border border-orange/30 bg-orange-wash px-4 py-3 text-sm text-navy-deep">
              El pago en línea se habilita en breve. Te enviaremos el enlace de pago por WhatsApp.
            </p>
          )}
        </div>

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
