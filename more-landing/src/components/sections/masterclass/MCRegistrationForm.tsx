import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle2, Loader2, Calendar, Users, Download, ChevronDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/IN6xGGn4Lr2JQsZzwN2EQa"
const EVENT_DATE = new Date("2026-05-25T19:00:00-05:00")

const COUNTRY_CODES = [
  { code: "+57",  flag: "🇨🇴", dial: "+57"  },
  { code: "+52",  flag: "🇲🇽", dial: "+52"  },
  { code: "+1",   flag: "🇺🇸", dial: "+1"   },
  { code: "+51",  flag: "🇵🇪", dial: "+51"  },
  { code: "+56",  flag: "🇨🇱", dial: "+56"  },
  { code: "+54",  flag: "🇦🇷", dial: "+54"  },
  { code: "+593", flag: "🇪🇨", dial: "+593" },
  { code: "+58",  flag: "🇻🇪", dial: "+58"  },
  { code: "+506", flag: "🇨🇷", dial: "+506" },
  { code: "+507", flag: "🇵🇦", dial: "+507" },
  { code: "+502", flag: "🇬🇹", dial: "+502" },
  { code: "+503", flag: "🇸🇻", dial: "+503" },
  { code: "+504", flag: "🇭🇳", dial: "+504" },
  { code: "+505", flag: "🇳🇮", dial: "+505" },
  { code: "+591", flag: "🇧🇴", dial: "+591" },
  { code: "+595", flag: "🇵🇾", dial: "+595" },
  { code: "+598", flag: "🇺🇾", dial: "+598" },
  { code: "+809", flag: "🇩🇴", dial: "+809" },
  { code: "+34",  flag: "🇪🇸", dial: "+34"  },
]

const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Colombia",           flag: "🇨🇴" },
  { name: "México",             flag: "🇲🇽" },
  { name: "Estados Unidos",     flag: "🇺🇸" },
  { name: "Perú",               flag: "🇵🇪" },
  { name: "Chile",              flag: "🇨🇱" },
  { name: "Argentina",          flag: "🇦🇷" },
  { name: "Ecuador",            flag: "🇪🇨" },
  { name: "Venezuela",          flag: "🇻🇪" },
  { name: "Costa Rica",         flag: "🇨🇷" },
  { name: "Panamá",             flag: "🇵🇦" },
  { name: "Guatemala",          flag: "🇬🇹" },
  { name: "El Salvador",        flag: "🇸🇻" },
  { name: "Honduras",           flag: "🇭🇳" },
  { name: "Nicaragua",          flag: "🇳🇮" },
  { name: "Bolivia",            flag: "🇧🇴" },
  { name: "Paraguay",           flag: "🇵🇾" },
  { name: "Uruguay",            flag: "🇺🇾" },
  { name: "República Dominicana", flag: "🇩🇴" },
  { name: "España",             flag: "🇪🇸" },
  { name: "Otro",               flag: "🌍" },
]

type FormData = {
  nombre: string
  email: string
  countryCode: string
  phone: string
  pais: string
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
  if (!data.pais) errors.pais = "Selecciona tu país"
  return errors
}

const GOOGLE_CALENDAR_URL = (() => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Masterclass: El Paso Cero EB2-NIW — MORE",
    dates: "20260525T190000/20260525T210000",
    ctz: "America/Bogota",
    details: "Masterclass gratuita con Ivon More.\\nDescubre el primer paso para migrar a EE.UU. con la visa EB2-NIW.\\n\\nLink de acceso se enviará por WhatsApp y email.",
    location: "Online (Zoom)",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
})()

function generateICS(): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MORE//Masterclass//ES",
    "BEGIN:VEVENT",
    "DTSTART;TZID=America/Bogota:20260525T190000",
    "DTEND;TZID=America/Bogota:20260525T210000",
    "SUMMARY:Masterclass: El Paso Cero EB2-NIW — MORE",
    "DESCRIPTION:Masterclass gratuita con Ivon More.\\nDescubre el primer paso para migrar a EE.UU. con la visa EB2-NIW.\\nLink de acceso se enviará por WhatsApp y email.",
    "LOCATION:Online (Zoom)",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

function downloadICS() {
  const blob = new Blob([generateICS()], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "masterclass-more-eb2niw.ics"
  a.click()
  URL.revokeObjectURL(url)
}

// ── Custom flag select ──────────────────────────────────────────────────────

type FlagOption = { value: string; flag: string; label: string }

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
              <span className="text-xl leading-none shrink-0">{selected.flag}</span>
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
                  <span className="text-xl leading-none w-7 text-center shrink-0">{opt.flag}</span>
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

function SuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-2xl bg-gradient-to-b from-[#0033A0] to-[#001A52] shadow-2xl border border-white/10 p-8 sm:p-10 max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          ¡Tu lugar está reservado!
        </h2>
        <p className="text-white/60 text-sm">
          Revisa tu email y tu WhatsApp. Te enviamos los detalles del evento.
        </p>
      </div>

      <div className="h-px bg-white/10 mb-6" />

      {/* Add to Calendar */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Agendá la masterclass
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-white/10 border border-white/15 rounded-lg hover:bg-white/20 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 3H6a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" />
              <path d="M16 1v4M8 1v4M3 9h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Google Calendar
          </a>
          <button
            type="button"
            onClick={downloadICS}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-white/10 border border-white/15 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Download className="h-4 w-4" />
            Apple / Outlook
          </button>
        </div>
      </div>

      {/* QR WhatsApp */}
      <div className="mb-6 p-5 bg-white/5 border border-white/10 rounded-xl text-center">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Únete al grupo de WhatsApp
        </p>
        <div className="w-40 h-40 mx-auto mb-3 bg-white rounded-xl p-2">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(WHATSAPP_GROUP_URL)}&margin=8`}
            alt="QR — Grupo de WhatsApp"
            className="w-full h-full"
            loading="eager"
          />
        </div>
        <p className="text-[10px] text-white/40">
          Escanea con tu cámara para unirte
        </p>
      </div>

      {/* WhatsApp button */}
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-bold text-white bg-[#25D366] rounded-lg shadow-md hover:bg-[#20BD5A] transition-all duration-300"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Unirme al grupo de WhatsApp
      </a>
    </motion.div>
  )
}

function ExpiredCard() {
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
        La masterclass Paso Cero EB2-NIW ya fue realizada. Seguinos en redes
        para enterarte de próximos eventos.
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

export default function MCRegistrationForm() {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    countryCode: "+57",
    phone: "",
    pais: "",
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

    try {
      const edgeFunctionUrl = import.meta.env.VITE_MASTERCLASS_REGISTER_URL

      if (edgeFunctionUrl) {
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
            pais: form.pais,
            ...utmParams,
          }),
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            (body as Record<string, string>).error || "Error al registrar"
          )
        }
      } else if (supabase) {
        await supabase.from("masterclass_leads").insert({
          nombre: form.nombre.trim(),
          email: form.email.trim().toLowerCase(),
          whatsapp: fullPhone,
          country: form.pais,
          source: "masterclass-eb2niw-2026",
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          utm_content: utmParams.utm_content,
          utm_term: utmParams.utm_term,
          status: "new",
        })
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo."
      )
    } finally {
      setSubmitting(false)
    }
  }, [form, utmParams])

  const [isExpired, setIsExpired] = useState(() => Date.now() > EVENT_DATE.getTime())

  useEffect(() => {
    if (isExpired) return
    const msUntilExpiry = EVENT_DATE.getTime() - Date.now()
    if (msUntilExpiry <= 0) {
      setIsExpired(true)
      return
    }
    const t = setTimeout(() => setIsExpired(true), msUntilExpiry)
    return () => clearTimeout(t)
  }, [isExpired])

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
                Clase gratuita · 25 de mayo 2026
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                ¿Listo para dar el{" "}
                <span className="text-[#F37021]">primer paso</span> hacia{" "}
                EE.&nbsp;UU.?
              </h2>
              <p className="text-white/55 text-sm mt-2">
                Regístrate en 30 segundos y asegura tu lugar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isExpired ? (
            <ExpiredCard key="expired" />
          ) : submitted ? (
            <SuccessCard key="success" />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/10 overflow-hidden"
            >
              {/* Colored top stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#F37021] via-[#FFAA5E] to-[#F37021]" />

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
                      htmlFor="mc-nombre"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      Nombre completo
                    </label>
                    <Input
                      id="mc-nombre"
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
                      htmlFor="mc-email"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      Email
                    </label>
                    <Input
                      id="mc-email"
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
                      htmlFor="mc-phone"
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
                          flag: c.flag,
                          label: c.dial,
                        }))}
                        compact
                      />
                      <Input
                        id="mc-phone"
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
                      htmlFor="mc-pais"
                      className="block text-xs font-semibold text-[#1A2340] mb-1 uppercase tracking-wide"
                    >
                      País de residencia
                    </label>
                    <FlagSelect
                      value={form.pais}
                      onChange={handleFlagSelect("pais")}
                      options={COUNTRIES.map((c) => ({
                        value: c.name,
                        flag: c.flag,
                        label: c.name,
                      }))}
                      placeholder="Selecciona tu país"
                    />
                    {errors.pais && (
                      <p className="mt-1 text-xs text-red-500">{errors.pais}</p>
                    )}
                  </div>
                </div>

                {submitError && (
                  <p className="mt-3 text-sm text-red-500 text-center">
                    {submitError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={
                    submitting
                      ? {}
                      : { scale: 1.02, transition: { duration: 0.15, ease: "easeOut" } }
                  }
                  whileTap={
                    submitting
                      ? {}
                      : { scale: 0.97, transition: { duration: 0.08 } }
                  }
                  animate={
                    submitting
                      ? {}
                      : {
                          boxShadow: [
                            "0 6px 20px rgba(243,112,33,0.35)",
                            "0 10px 32px rgba(243,112,33,0.6)",
                            "0 6px 20px rgba(243,112,33,0.35)",
                          ],
                        }
                  }
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 w-full h-14 rounded-xl bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white text-base font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 hover:from-[#D4611A] hover:to-[#F37021]"
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
                </motion.button>

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
