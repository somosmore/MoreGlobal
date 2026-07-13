import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle2, Loader2, Calendar, Users, ChevronDown, Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useOfferWindow } from "@/hooks/useOfferWindow"
import { getFbpFbcFromDocument, trackMasterclassRegistration } from "@/lib/tracking"
import {
  getTallerNiwFormCopy,
  type TallerNiwFormVariant,
} from "@/components/sections/taller-niw/tallerNiwCopy"
import "flag-icons/css/flag-icons.min.css"

import TNWhatsappJoinCard from "@/components/sections/taller-niw/TNWhatsappJoinCard"
/** Identificador del evento para distinguir estos leads en la base de datos / GHL. */
const TALLER_SOURCE = "taller-redflags-2026"
const TALLER_EVENT_LABEL = "Taller Red Flags Abogados"
/** Etiqueta (tag) con la que se marcan los leads en GoHighLevel. */
const TALLER_GHL_TAG = "Taller-julio-2026"

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
  profesion: string
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
  // País se deriva de la lada y profesión es opcional → no se validan.
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
              <span className="text-[#1A2340] truncate">{selected.label}</span>
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
                      : "text-[#1A2340] hover:bg-[#FFF8F3]"
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

function SuccessCard({ variant }: { variant: TallerNiwFormVariant }) {
  return <TNWhatsappJoinCard variant={variant} />
}

function ExpiredCard({ body }: { body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-2xl bg-white shadow-xl border border-gray-100 p-8 sm:p-10 max-w-md mx-auto text-center"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <Calendar className="h-8 w-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A2340] mb-3">
        Este evento ya finalizó
      </h2>
      <p className="text-[#6B7A9A] mb-6">
        {body}
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center h-11 px-6 text-sm font-semibold text-white bg-[#0033A0] rounded-lg hover:bg-[#001A52] transition-colors"
      >
        Volver al inicio
      </a>
    </motion.div>
  )
}

type TNRegistrationFormProps = {
  variant?: TallerNiwFormVariant
}

export default function TNRegistrationForm({ variant = "default" }: TNRegistrationFormProps) {
  const copy = getTallerNiwFormCopy(variant)
  const { settings } = useSiteSettings()
  const nombreInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    countryCode: "+57",
    phone: "",
    profesion: "",
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
  // (evento `focus-registro` disparado por scrollToRegistro), si la página
  // carga con #registro, o en la variante ads al montar la página.
  useEffect(() => {
    const focusFirstField = () => {
      window.setTimeout(() => nombreInputRef.current?.focus(), variant === "ads" ? 150 : 500)
    }
    window.addEventListener("focus-registro", focusFirstField)
    if (variant === "ads" || window.location.hash === "#registro") focusFirstField()
    return () => window.removeEventListener("focus-registro", focusFirstField)
  }, [variant])

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
          profesion: form.profesion.trim(),
          source: TALLER_SOURCE,
          event_label: TALLER_EVENT_LABEL,
          ghl_tag: TALLER_GHL_TAG,
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
      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo."
      )
    } finally {
      setSubmitting(false)
    }
  }, [form, utmParams, settings])

  // El cierre de inscripción se configura en Admin → Settings, no en el código.
  const { expired: isExpired } = useOfferWindow(settings.tn_registration_closes_at)

  return (
    <section
      id="registro"
      className="relative py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-[#001A52] via-[#0033A0] to-[#001233]"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-[#F37021]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#F37021]/8 blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 sm:px-6">
        {/* Section headline (outside the card) */}
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
              <p className="text-[#FFBA7A] text-xs font-semibold uppercase tracking-widest mb-2">
                {copy.formEyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {copy.formHeadlineBefore}{" "}
                <span className="text-[#F37021]">{copy.formHeadlineHighlight}</span>, mira esto
              </h2>
              <p className="text-white/55 text-sm mt-2">
                {copy.formSubcopy}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isExpired ? (
            <ExpiredCard key="expired" body={copy.expiredBody} />
          ) : submitted ? (
            <SuccessCard key="success" variant={variant} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/10"
            >
              {/* Colored top stripe — rounded-t para no necesitar overflow-hidden en el padre */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#F37021] via-[#FFAA5E] to-[#F37021] rounded-t-2xl" />

              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-5">
                  <Badge variant="orange" className="gap-1.5">
                    <Users className="h-3 w-3" />
                    CUPOS LIMITADOS
                  </Badge>
                  <div className="flex items-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-full px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0" />
                    <span className="text-xs font-bold text-[#10B981] uppercase tracking-wide">
                      100% Gratis
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="tn-nombre"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      Nombre completo
                    </label>
                    <Input
                      ref={nombreInputRef}
                      id="tn-nombre"
                      name="nombre"
                      type="text"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej: María García"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tn-email"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      Email
                    </label>
                    <Input
                      id="tn-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tn-phone"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
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
                        id="tn-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="300 123 4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tn-profesion"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      Profesión <span className="text-[#9BAAB8] normal-case font-normal">(opcional)</span>
                    </label>
                    <Input
                      id="tn-profesion"
                      name="profesion"
                      type="text"
                      value={form.profesion}
                      onChange={handleChange}
                      placeholder="Ej: Ingeniera, Médico, Diseñador…"
                    />
                    {errors.profesion && (
                      <p className="mt-1 text-xs text-red-500">{errors.profesion}</p>
                    )}
                  </div>
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
                      QUIERO MI LUGAR GRATIS
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#9BAAB8]">
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
