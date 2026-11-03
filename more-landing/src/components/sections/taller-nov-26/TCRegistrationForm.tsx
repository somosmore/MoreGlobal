import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Loader2, ChevronDown, Globe, CalendarX, Plane } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useOfferWindow } from "@/hooks/useOfferWindow"
import { getFbpFbcFromDocument, trackMasterclassRegistration } from "@/lib/tracking"
import { cn } from "@/lib/utils"
import { capturePartialLead } from "@/lib/partialLead"
import {
  TALLER_EVENT_LABEL,
  TALLER_GHL_TAG,
  TALLER_SOURCE,
  TICKETS,
  type TicketType,
} from "@/components/sections/taller-nov-26/tallerNov26Copy"
import "flag-icons/css/flag-icons.min.css"

import TCPaymentCard from "@/components/sections/taller-nov-26/TCPaymentCard"

const COUNTRY_CODES = [
  { code: "+57",  iso: "co", dial: "+57"  },
  { code: "+52",  iso: "mx", dial: "+52"  },
  { code: "+1",   iso: "us", dial: "+1"   },
  { code: "+51",  iso: "pe", dial: "+51"  },
  { code: "+56",  iso: "cl", dial: "+56"  },
  { code: "+54",  iso: "ar", dial: "+54"  },
  { code: "+593", iso: "ec", dial: "+593" },
  { code: "+58",  iso: "ve", dial: "+58"  },
  { code: "+506", iso: "cr", dial: "+506" },
  { code: "+507", iso: "pa", dial: "+507" },
  { code: "+502", iso: "gt", dial: "+502" },
  { code: "+503", iso: "sv", dial: "+503" },
  { code: "+504", iso: "hn", dial: "+504" },
  { code: "+505", iso: "ni", dial: "+505" },
  { code: "+591", iso: "bo", dial: "+591" },
  { code: "+595", iso: "py", dial: "+595" },
  { code: "+598", iso: "uy", dial: "+598" },
  { code: "+809", iso: "do", dial: "+809" },
  { code: "+34",  iso: "es", dial: "+34"  },
]

// País de residencia derivado del prefijo telefónico (un campo menos en el form).
const DIAL_TO_COUNTRY: Record<string, string> = {
  "+57":  "Colombia",
  "+52":  "México",
  "+1":   "Estados Unidos",
  "+51":  "Perú",
  "+56":  "Chile",
  "+54":  "Argentina",
  "+593": "Ecuador",
  "+58":  "Venezuela",
  "+506": "Costa Rica",
  "+507": "Panamá",
  "+502": "Guatemala",
  "+503": "El Salvador",
  "+504": "Honduras",
  "+505": "Nicaragua",
  "+591": "Bolivia",
  "+595": "Paraguay",
  "+598": "Uruguay",
  "+809": "República Dominicana",
  "+34":  "España",
}

type FormData = {
  nombre: string
  email: string
  countryCode: string
  phone: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

type UtmParams = {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
}

function getUtmParams(): UtmParams {
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
  }
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.nombre.trim()) errors.nombre = "Ingresa tu nombre completo"
  if (!data.email.trim()) {
    errors.email = "Ingresa tu email"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Ingresa un email válido"
  }
  if (!data.phone.trim()) {
    errors.phone = "Ingresa tu número de WhatsApp"
  } else if (!/^\d{6,15}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Ingresa un número válido"
  }
  // País se deriva de la lada → no se valida.
  return errors
}

// ── Custom flag select ──────────────────────────────────────────────────────

type FlagOption = { value: string; iso: string; label: string }

function FlagIcon({ iso }: { iso: string }) {
  if (!iso) return <Globe className="h-4 w-4 text-gray-400 shrink-0" />
  return (
    <span
      className={`fi fi-${iso} shrink-0`}
      style={{ width: "1.33em", height: "1em", borderRadius: 2, display: "inline-block" }}
    />
  )
}

function FlagSelect({
  value,
  onChange,
  options,
  placeholder = "Selecciona…",
  compact = false,
}: {
  value: string
  onChange: (v: string) => void
  options: FlagOption[]
  placeholder?: string
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onOutside)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onOutside)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-1 h-11 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]/30 focus:border-[#F37021]/60 transition-all duration-200 ${
          open ? "border-[#F37021]/60 ring-2 ring-[#F37021]/30" : "border-gray-300"
        } ${compact ? "w-[108px] sm:w-[120px] px-2" : "w-full px-3"}`}
      >
        <span className="flex items-center gap-2 min-w-0 truncate">
          {selected ? (
            <>
              <FlagIcon iso={selected.iso} />
              <span className="truncate text-navy-deep">{selected.label}</span>
            </>
          ) : (
            <span className="text-gray-400 truncate">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
            role="listbox"
          >
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={opt.value === value}>
                <button
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                    opt.value === value
                      ? "bg-[#FFF3EA] text-[#D4611A] font-semibold"
                      : "text-navy-deep hover:bg-orange-wash"
                  }`}
                >
                  <span className="w-6 flex items-center justify-center shrink-0">
                    <FlagIcon iso={opt.iso} />
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────────

function ExpiredCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md rounded-2xl border border-navy/15 bg-white p-8 text-center shadow-sm sm:p-10"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <CalendarX className="h-8 w-8 text-gray-400" aria-hidden />
      </div>
      <h2 className="mb-3 text-2xl font-bold text-navy-deep">Las inscripciones cerraron</h2>
      <p className="mb-6 text-ink-muted">
        El taller ya comenzó o se completaron los cupos. Únete a la Comunidad More para
        enterarte del próximo.
      </p>
      <a
        href="/comunidad"
        className="inline-flex h-11 items-center justify-center rounded-full bg-navy-deep px-6 text-sm font-semibold text-white transition-colors hover:bg-navy-ink"
      >
        Unirme a la comunidad
      </a>
    </motion.div>
  )
}

export default function TCRegistrationForm() {
  const { settings } = useSiteSettings()
  const nombreInputRef = useRef<HTMLInputElement>(null)
  const [ticket, setTicket] = useState<TicketType>("general")
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    countryCode: "+57",
    phone: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<UtmParams>({
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
  })

  useEffect(() => {
    setUtmParams(getUtmParams())
  }, [])

  // Enfoca el primer campo cuando el usuario llega al form vía un CTA
  // (evento `focus-registro`) o si la página carga con #registro, y
  // preselecciona la entrada elegida en la sección de entradas (`select-ticket`).
  useEffect(() => {
    const focusFirstField = () => {
      window.setTimeout(() => nombreInputRef.current?.focus(), 500)
    }
    const onSelectTicket = (e: Event) => {
      const detail = (e as CustomEvent<TicketType>).detail
      if (detail === "general" || detail === "vip") setTicket(detail)
    }
    window.addEventListener("focus-registro", focusFirstField)
    window.addEventListener("select-ticket", onSelectTicket)
    if (window.location.hash === "#registro") focusFirstField()
    return () => {
      window.removeEventListener("focus-registro", focusFirstField)
      window.removeEventListener("select-ticket", onSelectTicket)
    }
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      setSubmitError(null)
    },
    []
  )

  const handleFlagSelect = useCallback(
    (field: keyof FormData) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
      setSubmitError(null)
    },
    []
  )

  // Remarketing: guarda el email apenas es válido y suma teléfono/país/nombre/entrada
  // a medida que se completan (tabla partial_leads). No bloquea ni muestra errores.
  const savePartial = useCallback(
    (overrides: { completed?: boolean; ticketType?: TicketType } = {}) => {
      const digits = form.phone.replace(/\D/g, "")
      const phoneOk = digits.length >= 6 && digits.length <= 15
      void capturePartialLead(TALLER_SOURCE, {
        email: form.email,
        nombre: form.nombre,
        phone: phoneOk ? `${form.countryCode}${digits}` : undefined,
        pais: phoneOk ? DIAL_TO_COUNTRY[form.countryCode] ?? "Otro" : undefined,
        ticketType: overrides.ticketType ?? ticket,
        utm: utmParams,
        completed: overrides.completed,
      })
    },
    [form, ticket, utmParams]
  )

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const fullPhone = `${form.countryCode}${form.phone.replace(/\s/g, "")}`
    const pais = DIAL_TO_COUNTRY[form.countryCode] ?? "Otro"
    const capiEventId = crypto.randomUUID()
    const { fbp, fbc } = getFbpFbcFromDocument()

    try {
      const edgeFunctionUrl = import.meta.env.VITE_MASTERCLASS_REGISTER_URL
      if (!edgeFunctionUrl) {
        throw new Error("Error de configuración. Contacta al administrador.")
      }

      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const res = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`,
        },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          phone: fullPhone,
          pais,
          source: TALLER_SOURCE,
          event_label: TALLER_EVENT_LABEL,
          ghl_tag: TALLER_GHL_TAG,
          ticket_type: ticket,
          ...utmParams,
          capi_event_id: capiEventId,
          client_user_agent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          event_source_url:
            typeof window !== "undefined" ? window.location.href : "",
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          (body as Record<string, string>).error || "Error al registrar"
        )
      }

      void trackMasterclassRegistration(settings, { eventId: capiEventId })
      savePartial({ completed: true })
      setSubmittedEmail(form.email.trim().toLowerCase())
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo."
      )
    } finally {
      setSubmitting(false)
    }
  }, [form, utmParams, settings, ticket, savePartial])

  // El cierre de inscripción se configura en Admin → Settings → Taller Comunidad.
  const { expired: isExpired } = useOfferWindow(settings.tc_registration_closes_at)

  return (
    <section
      id="registro"
      className="relative overflow-hidden bg-paper-warm py-12 sm:py-16"
    >
      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {!submitted && !isExpired && (
            <motion.div
              key="headline"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-6"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-dark">
                Check-in · Paso 1 de 2
              </p>
              <h2 className="font-sans text-2xl font-extrabold tracking-tight leading-tight text-navy-deep sm:text-3xl">
                Reserva tu lugar en el{" "}
                <span className="text-[#F37021]">Taller Comunidad More</span>
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Déjanos tus datos y en el siguiente paso completas el pago de tu entrada.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isExpired ? (
            <ExpiredCard key="expired" />
          ) : submitted ? (
            <TCPaymentCard key="success" ticket={ticket} email={submittedEmail} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-navy-ink px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] sm:px-8">
                <span className="flex items-center gap-2 text-white">
                  <Plane className="h-3.5 w-3.5 text-orange" aria-hidden />
                  Check-in
                </span>
                <span className="text-navy-soft">MORE 2311 · 23 NOV · 19:00 COT</span>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="tc-nombre"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-deep"
                    >
                      Nombre completo
                    </label>
                    <Input
                      ref={nombreInputRef}
                      id="tc-nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      onBlur={() => savePartial()}
                      placeholder="Ej: María García"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tc-email"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-deep"
                    >
                      Email
                    </label>
                    <Input
                      id="tc-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => savePartial()}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tc-phone"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-navy-deep"
                    >
                      WhatsApp
                    </label>
                    <div className="flex gap-2">
                      <FlagSelect
                        value={form.countryCode}
                        onChange={handleFlagSelect("countryCode")}
                        options={COUNTRY_CODES.map((c) => ({
                          value: c.code,
                          iso: c.iso,
                          label: c.dial,
                        }))}
                        compact
                      />
                      <Input
                        id="tc-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={() => savePartial()}
                        placeholder="300 123 4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <fieldset>
                    <legend className="mb-2 block text-xs font-semibold uppercase tracking-wide text-navy-deep">
                      Tu entrada
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {TICKETS.map((t) => {
                        const price = settings[t.priceKey].trim()
                        const selected = ticket === t.id
                        return (
                          <label
                            key={t.id}
                            className={cn(
                              "flex cursor-pointer flex-col rounded-lg border px-4 py-3 transition-colors",
                              selected
                                ? "border-orange bg-orange-wash"
                                : "border-gray-300 bg-white hover:border-orange/50",
                            )}
                          >
                            <input
                              type="radio"
                              name="ticket"
                              value={t.id}
                              checked={selected}
                              onChange={() => {
                                setTicket(t.id)
                                savePartial({ ticketType: t.id })
                              }}
                              className="sr-only"
                            />
                            <span className="text-sm font-bold text-navy-deep">{t.name}</span>
                            <span className="text-xs text-ink-muted">
                              {price || "Precio por confirmar"}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                </div>

                {submitError && (
                  <p className="mt-3 text-sm text-red-500 text-center">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-shine mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-orange text-base font-bold tracking-wide text-white shadow-md shadow-orange/25 hover:bg-orange-dark hover:shadow-lg hover:shadow-orange/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      REGISTRANDO...
                    </>
                  ) : (
                    <>
                      Continuar al pago
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#9BAAB8]">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Tu información está segura. No compartimos tus datos.
                  </span>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
