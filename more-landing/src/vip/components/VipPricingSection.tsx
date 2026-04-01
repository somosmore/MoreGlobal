import { Shield } from "lucide-react"
import { VipCtaButton } from "./VipCtaButton"

type VipPricingSectionProps = {
  calendarUrl?: string | null
  loading?: boolean
}

export const VipPricingSection = ({
  calendarUrl,
  loading,
}: VipPricingSectionProps) => {
  const ctaLabel = "Sí, quiero evaluar mi perfil con Ivon — $97 USD"

  return (
    <section className="space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-t-4 border-orange/80 pt-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Inversión única
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-navy">$97</span>
            <span className="text-sm font-medium text-gray-500">USD</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Sesión 1 a 1 · 60 minutos con Ivon
          </p>
        </div>
        <div className="w-full max-w-xs">
          <VipCtaButton
            label={ctaLabel}
            calendarUrl={calendarUrl}
            loading={loading}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs text-green-900 sm:max-w-sm">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
          <p>
            🛡 Si en los primeros 15 minutos vemos que tu caso no encaja de verdad, te devolvemos
            el dinero. Sin preguntas ni discusiones.
          </p>
        </div>
        <p className="text-xs italic text-gray-500 sm:text-[13px]">
          Una hora que puede ahorrarte meses de decisiones equivocadas y miles de dólares
          invertidos en el camino incorrecto.
        </p>
      </div>
      <p className="mt-2 text-center text-xs italic text-gray-400 sm:text-[13px]">
        La única decisión más cara que invertir $97 en claridad es seguir decidiendo a
        ciegas sobre tu migración.
      </p>
    </section>
  )
}

