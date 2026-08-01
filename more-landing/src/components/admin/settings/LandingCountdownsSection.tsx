import { AlertCircle, CalendarClock, CheckCircle, Loader2, Save } from "lucide-react"
import { useOfferWindow } from "@/hooks/useOfferWindow"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "mcEventDate"
  | "setMcEventDate"
  | "mcRegistrationClosesAt"
  | "setMcRegistrationClosesAt"
  | "tnEventDate"
  | "setTnEventDate"
  | "tnRegistrationClosesAt"
  | "setTnRegistrationClosesAt"
  | "landingsSaveState"
  | "setLandingsSaveState"
  | "landingsSaveError"
  | "handleSaveLandings"
>

type FieldProps = {
  id: string
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
}

/** Un campo de fecha con su estado ("faltan X" / "ya pasó"), calculado en vivo. */
function DateField({ id, label, hint, value, onChange }: FieldProps) {
  const { expired, timeLeft } = useOfferWindow(value)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={id}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
      />
      <p className="text-xs text-gray-400">{hint}</p>
      {value.trim() && (
        <p className={`text-xs font-medium ${expired ? "text-red-600" : "text-emerald-600"}`}>
          {expired
            ? "Ya pasó: la landing muestra el estado de cierre."
            : timeLeft
              ? `Faltan ${timeLeft.days} d ${timeLeft.hours} h ${timeLeft.minutes} min.`
              : ""}
        </p>
      )}
    </div>
  )
}

export default function LandingCountdownsSection({
  loading,
  mcEventDate,
  setMcEventDate,
  mcRegistrationClosesAt,
  setMcRegistrationClosesAt,
  tnEventDate,
  setTnEventDate,
  tnRegistrationClosesAt,
  setTnRegistrationClosesAt,
  landingsSaveState,
  setLandingsSaveState,
  landingsSaveError,
  handleSaveLandings,
}: Props) {
  const onChange = (setter: (v: string) => void) => (value: string) => {
    setter(value)
    setLandingsSaveState("idle")
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10">
          <CalendarClock className="h-4 w-4 text-orange" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy">
            Landings de campaña - Fechas y cierre
          </h2>
          <p className="text-xs text-gray-400">
            Contador y cierre de inscripción del taller y la masterclass
          </p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando configuración…
          </div>
        ) : (
          <>
            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Taller Cambio de Estatus (/taller-niw)
              </p>
              <DateField
                id="tn-event-date"
                label="Fecha del taller (contador)"
                hint="El contador del hero cuenta hasta esta fecha. Vacío: no se muestra contador."
                value={tnEventDate}
                onChange={onChange(setTnEventDate)}
              />
              <DateField
                id="tn-registration-closes"
                label="Cierre de inscripciones"
                hint="Después de esta fecha el formulario se reemplaza por el aviso de cierre."
                value={tnRegistrationClosesAt}
                onChange={onChange(setTnRegistrationClosesAt)}
              />
            </div>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Masterclass (/masterclass)
              </p>
              <DateField
                id="mc-event-date"
                label="Fecha de la masterclass (contador)"
                hint="El contador del hero cuenta hasta esta fecha. Vacío: no se muestra contador."
                value={mcEventDate}
                onChange={onChange(setMcEventDate)}
              />
              <DateField
                id="mc-registration-closes"
                label="Cierre de inscripciones"
                hint="Después de esta fecha el formulario se reemplaza por el aviso de cierre."
                value={mcRegistrationClosesAt}
                onChange={onChange(setMcRegistrationClosesAt)}
              />
            </div>

            <button
              type="button"
              onClick={handleSaveLandings}
              disabled={landingsSaveState === "saving"}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {landingsSaveState === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar
            </button>

            {landingsSaveState === "error" && landingsSaveError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{landingsSaveError}</span>
              </div>
            )}

            {landingsSaveState === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Fechas guardadas correctamente.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
