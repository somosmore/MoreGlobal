import { AlertCircle, CheckCircle, ExternalLink, Loader2, Save, Ticket } from "lucide-react"
import { DateField } from "./LandingCountdownsSection"
import type { SettingsData } from "./useSettingsData"

type Props = Pick<
  SettingsData,
  | "loading"
  | "tcEventDate"
  | "setTcEventDate"
  | "tcRegistrationClosesAt"
  | "setTcRegistrationClosesAt"
  | "tcGeneralPrice"
  | "setTcGeneralPrice"
  | "tcGeneralPaymentLink"
  | "setTcGeneralPaymentLink"
  | "tcVipPrice"
  | "setTcVipPrice"
  | "tcVipPaymentLink"
  | "setTcVipPaymentLink"
  | "tcSaveState"
  | "setTcSaveState"
  | "tcSaveError"
  | "handleSaveTallerComunidad"
  | "tcGeneralPaymentLinkInvalid"
  | "tcVipPaymentLinkInvalid"
>

type TicketFieldsProps = {
  prefix: string
  title: string
  price: string
  onPrice: (v: string) => void
  link: string
  onLink: (v: string) => void
  linkInvalid: boolean
}

function TicketFields({ prefix, title, price, onPrice, link, onLink, linkInvalid }: TicketFieldsProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>

      <div className="space-y-1.5">
        <label htmlFor={`${prefix}-price`} className="block text-sm font-medium text-navy">
          Precio (texto visible)
        </label>
        <input
          id={`${prefix}-price`}
          type="text"
          value={price}
          onChange={(e) => onPrice(e.target.value)}
          placeholder="$150.000 COP"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
        />
        <p className="text-xs text-gray-400">Vacío: la landing muestra "Precio por confirmar".</p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${prefix}-link`} className="block text-sm font-medium text-navy">
          Link de pago
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`${prefix}-link`}
            type="url"
            value={link}
            onChange={(e) => onLink(e.target.value)}
            placeholder="https://buy.stripe.com/..."
            className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
              linkInvalid
                ? "border-red-300 bg-red-50 focus:border-red-400"
                : "border-gray-200 bg-gray-50 focus:border-orange focus:bg-white"
            }`}
          />
          {link.trim() && !linkInvalid && (
            <a
              href={link.trim()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Probar link de pago ${title}`}
              className="shrink-0 text-orange transition-colors hover:text-orange-dark"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {linkInvalid ? (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle className="h-3.5 w-3.5" />
            La URL no tiene un formato válido.
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            Vacío: tras registrarse, el lead ve "te enviaremos el link de pago por WhatsApp".
          </p>
        )}
      </div>
    </div>
  )
}

export default function TallerComunidadSection({
  loading,
  tcEventDate,
  setTcEventDate,
  tcRegistrationClosesAt,
  setTcRegistrationClosesAt,
  tcGeneralPrice,
  setTcGeneralPrice,
  tcGeneralPaymentLink,
  setTcGeneralPaymentLink,
  tcVipPrice,
  setTcVipPrice,
  tcVipPaymentLink,
  setTcVipPaymentLink,
  tcSaveState,
  setTcSaveState,
  tcSaveError,
  handleSaveTallerComunidad,
  tcGeneralPaymentLinkInvalid,
  tcVipPaymentLinkInvalid,
}: Props) {
  const onChange = (setter: (v: string) => void) => (value: string) => {
    setter(value)
    setTcSaveState("idle")
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10">
          <Ticket className="h-4 w-4 text-orange" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-navy">
            Taller Comunidad More (/taller-nov-26) - Fechas y entradas
          </h2>
          <p className="text-xs text-gray-400">
            Contador, cierre de inscripción y precios / links de pago de las entradas General y VIP
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
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Fechas</p>
              <DateField
                id="tc-event-date"
                label="Fecha del taller (contador)"
                hint="El contador del hero cuenta hasta esta fecha. Vacío: no se muestra contador."
                value={tcEventDate}
                onChange={onChange(setTcEventDate)}
              />
              <DateField
                id="tc-registration-closes"
                label="Cierre de inscripciones"
                hint="Después de esta fecha el formulario se reemplaza por el aviso de cierre."
                value={tcRegistrationClosesAt}
                onChange={onChange(setTcRegistrationClosesAt)}
              />
            </div>

            <TicketFields
              prefix="tc-general"
              title="Entrada General"
              price={tcGeneralPrice}
              onPrice={onChange(setTcGeneralPrice)}
              link={tcGeneralPaymentLink}
              onLink={onChange(setTcGeneralPaymentLink)}
              linkInvalid={tcGeneralPaymentLinkInvalid}
            />

            <TicketFields
              prefix="tc-vip"
              title="Entrada VIP"
              price={tcVipPrice}
              onPrice={onChange(setTcVipPrice)}
              link={tcVipPaymentLink}
              onLink={onChange(setTcVipPaymentLink)}
              linkInvalid={tcVipPaymentLinkInvalid}
            />

            <button
              type="button"
              onClick={handleSaveTallerComunidad}
              disabled={
                tcSaveState === "saving" || tcGeneralPaymentLinkInvalid || tcVipPaymentLinkInvalid
              }
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tcSaveState === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Guardar taller
            </button>

            {tcSaveState === "error" && tcSaveError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{tcSaveError}</span>
              </div>
            )}

            {tcSaveState === "success" && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Configuración del taller guardada correctamente.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
