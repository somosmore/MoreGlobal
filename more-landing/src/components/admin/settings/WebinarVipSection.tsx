import { useState } from "react"
import { AlertCircle, CheckCircle, Crown, ExternalLink, Loader2, Save } from "lucide-react"
import { supabase, type SiteSettingsMap } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { DateField } from "./LandingCountdownsSection"
import { toIso, toLocalInput, type SaveState } from "./useSettingsData"

const isUrl = (v: string) => /^https?:\/\/\S+$/i.test(v.trim())
const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"

/** Webinar VIP (/webinar-vip-rfe): fecha, cierre, precio y link de pago. Lee y guarda sus propias claves. */
export default function WebinarVipSection() {
  const { settings, loading, refetch } = useSiteSettings()

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10">
          <Crown className="h-4 w-4 text-orange" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy">Webinar VIP (/webinar-vip-rfe) - Fecha, precio y pago</h2>
          <p className="text-xs text-gray-400">Solo miembros VIP. Contador, cierre de inscripción y link de pago de la entrada.</p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando configuración…
          </div>
        ) : (
          <WebinarVipFields settings={settings} refetch={refetch} />
        )}
      </div>
    </div>
  )
}

/** Se monta con la configuración ya cargada: arranca con esos valores, sin efecto. */
function WebinarVipFields({ settings, refetch }: { settings: SiteSettingsMap; refetch: () => void }) {
  const [eventDate, setEventDate] = useState(() => toLocalInput(settings.wv_event_date))
  const [closesAt, setClosesAt] = useState(() => toLocalInput(settings.wv_registration_closes_at))
  const [price, setPrice] = useState(settings.wv_price)
  const [link, setLink] = useState(settings.wv_payment_link)
  const [state, setState] = useState<SaveState>("idle")
  const [error, setError] = useState<string | null>(null)

  const linkInvalid = link.trim().length > 0 && !isUrl(link)
  const edit = (setter: (v: string) => void) => (v: string) => {
    setter(v)
    setState("idle")
  }

  const save = async () => {
    if (!supabase) {
      setError("No hay conexión con la base de datos.")
      setState("error")
      return
    }
    setState("saving")
    setError(null)
    const { error: err } = await supabase.from("site_settings").upsert(
      [
        { key: "wv_event_date", value: toIso(eventDate) },
        { key: "wv_registration_closes_at", value: toIso(closesAt) },
        { key: "wv_price", value: price.trim() },
        { key: "wv_payment_link", value: link.trim() },
      ],
      { onConflict: "key" },
    )
    if (err) {
      setError(err.message)
      setState("error")
      return
    }
    setState("success")
    refetch()
    setTimeout(() => setState("idle"), 3000)
  }

  return (
    <>
      <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Fechas</p>
        <DateField
          id="wv-event-date"
          label="Fecha y hora del webinar"
          hint="La landing muestra esta fecha y el contador cuenta hasta acá."
          value={eventDate}
          onChange={edit(setEventDate)}
        />
        <DateField
          id="wv-closes-at"
          label="Cierre de inscripción"
          hint="Después de esta hora el formulario muestra que las inscripciones cerraron."
          value={closesAt}
          onChange={edit(setClosesAt)}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Entrada</p>
        <div className="space-y-1.5">
          <label htmlFor="wv-price" className="block text-sm font-medium text-navy">
            Precio (texto visible)
          </label>
          <input id="wv-price" value={price} onChange={(e) => edit(setPrice)(e.target.value)} placeholder="$50 USD" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="wv-link" className="block text-sm font-medium text-navy">
            Link de pago (GHL o Stripe)
          </label>
          <input
            id="wv-link"
            value={link}
            onChange={(e) => edit(setLink)(e.target.value)}
            placeholder="https://api.moremigracion.com/payment-link/…"
            className={inputClass}
          />
          {linkInvalid ? (
            <p className="text-xs text-red-600">Tiene que empezar con https://</p>
          ) : link.trim() ? (
            <a href={link.trim()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange hover:underline">
              Probar el link <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <p className="text-xs text-gray-400">Vacío: después del registro se avisa que el link llega por WhatsApp.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={state === "saving" || linkInvalid}
        className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar webinar VIP
      </button>

      {state === "error" && error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {state === "success" && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          Guardado: la landing ya usa estos datos.
        </div>
      )}
    </>
  )
}
