import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, CheckCircle2, Loader2, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/IN6xGGn4Lr2JQsZzwN2EQa"
const EVENT_DATE = new Date("2026-05-25T19:00:00-05:00")

const COUNTRY_CODES = [
  { code: "+57", label: "CO +57" },
  { code: "+52", label: "MX +52" },
  { code: "+1", label: "US +1" },
  { code: "+51", label: "PE +51" },
  { code: "+56", label: "CL +56" },
  { code: "+54", label: "AR +54" },
  { code: "+593", label: "EC +593" },
  { code: "+58", label: "VE +58" },
  { code: "+506", label: "CR +506" },
  { code: "+507", label: "PA +507" },
  { code: "+502", label: "GT +502" },
  { code: "+503", label: "SV +503" },
  { code: "+504", label: "HN +504" },
  { code: "+505", label: "NI +505" },
  { code: "+591", label: "BO +591" },
  { code: "+595", label: "PY +595" },
  { code: "+598", label: "UY +598" },
  { code: "+809", label: "DO +809" },
  { code: "+34", label: "ES +34" },
]

const COUNTRIES = [
  "Colombia",
  "México",
  "Estados Unidos",
  "Perú",
  "Chile",
  "Argentina",
  "Ecuador",
  "Venezuela",
  "Costa Rica",
  "Panamá",
  "Guatemala",
  "El Salvador",
  "Honduras",
  "Nicaragua",
  "Bolivia",
  "Paraguay",
  "Uruguay",
  "República Dominicana",
  "España",
  "Otro",
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

function SuccessCard() {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = WHATSAPP_GROUP_URL
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-2xl bg-white shadow-xl border border-gray-100 p-8 sm:p-10 max-w-md mx-auto text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A2340] mb-3">
        ¡Tu lugar está reservado!
      </h2>
      <p className="text-[#6B7A9A] mb-4">
        Revisa tu email y tu WhatsApp. Te acabamos de enviar los detalles del
        evento.
      </p>
      <p className="text-sm text-[#6B7A9A] mb-6">
        Registro exitoso! Redirigiendo al grupo de WhatsApp en{" "}
        <span className="font-semibold text-[#1A2340]">{countdown}</span>{" "}
        segundos...
      </p>
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm font-bold text-white bg-[#25D366] rounded-lg shadow-md hover:bg-[#20BD5A] transition-all duration-300"
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

  const handleSubmit = async (e: React.FormEvent) => {
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
  }

  const isExpired = Date.now() > EVENT_DATE.getTime()

  return (
    <section id="registro" className="py-16 sm:py-20 bg-[#F8F9FC]">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
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
              className="rounded-2xl bg-white shadow-xl border border-gray-100 p-8 sm:p-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2340] text-center mb-2">
                Reserva tu lugar ahora
              </h2>
              <p className="text-[#6B7A9A] text-center text-sm mb-8">
                Los cupos son limitados. Regístrate en 30 segundos.
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="mc-nombre"
                    className="block text-sm font-medium text-[#1A2340] mb-1.5"
                  >
                    Nombre completo
                  </label>
                  <input
                    id="mc-nombre"
                    name="nombre"
                    type="text"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej: María García"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0033A0]/20 focus-visible:border-[#0033A0]/40 transition-all duration-200"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mc-email"
                    className="block text-sm font-medium text-[#1A2340] mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    id="mc-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0033A0]/20 focus-visible:border-[#0033A0]/40 transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mc-phone"
                    className="block text-sm font-medium text-[#1A2340] mb-1.5"
                  >
                    WhatsApp
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="h-11 w-[100px] sm:w-[120px] rounded-lg border border-gray-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0033A0]/20 focus-visible:border-[#0033A0]/40 transition-all duration-200"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="mc-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="300 123 4567"
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0033A0]/20 focus-visible:border-[#0033A0]/40 transition-all duration-200"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="mc-pais"
                    className="block text-sm font-medium text-[#1A2340] mb-1.5"
                  >
                    País de residencia
                  </label>
                  <select
                    id="mc-pais"
                    name="pais"
                    value={form.pais}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0033A0]/20 focus-visible:border-[#0033A0]/40 transition-all duration-200"
                  >
                    <option value="">Selecciona tu país</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.pais && (
                    <p className="mt-1 text-xs text-red-500">{errors.pais}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="mt-4 text-sm text-red-500 text-center">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full h-13 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white font-bold text-base shadow-lg hover:from-[#D4611A] hover:to-[#F37021] transition-all duration-300 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    REGISTRANDO...
                  </>
                ) : (
                  "QUIERO MI LUGAR GRATIS"
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#6B7A9A]">
                <Shield className="h-3.5 w-3.5" />
                <span>
                  Tu información está segura. No compartimos tus datos con
                  terceros.
                </span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
