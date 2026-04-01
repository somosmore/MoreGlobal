import { motion } from "framer-motion"
import { Shield, Sparkles } from "lucide-react"
import { VipCtaButton } from "./VipCtaButton"

type VipHeroProps = {
  calendarUrl?: string | null
  loading?: boolean
}

export const VipHero = ({ calendarUrl, loading }: VipHeroProps) => {
  const ctaLabel = "Sí, quiero mi diagnóstico estratégico con Ivon — $97 USD"

  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-linear-to-br from-white via-gray-50/50 to-navy/3">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-navy/[0.07] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/3 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-navy/5 px-4 py-2"
            >
              <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-wide text-navy/70">
                Asesoría VIP · Diagnóstico migratorio 1 a 1
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-navy sm:text-5xl lg:text-6xl">
                ¿Tu perfil realmente sostiene una{" "}
                <span className="relative z-10 bg-linear-to-r from-orange to-orange-dark bg-clip-text text-transparent">
                  Green Card
                </span>{" "}
                o solo una buena intención costosa.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-500">
                En 60 minutos, Ivon audita tu perfil con la metodología MORE para responder una sola
                pregunta: ¿vale la pena apostar por tu Green Card ahora mismo?
                Salís con una decisión clara y un plan a 90 días para no seguir decidiendo a ciegas.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    Asesoría VIP · 60 minutos · $97 USD
                  </p>
                  <p className="max-w-md text-sm text-gray-600">
                    En esta hora no venís a “informarte”, venís a tomar una decisión estratégica
                    sobre tu migración.
                  </p>
                  <ul className="mt-1.5 space-y-1.5 text-sm text-gray-700">
                    <li>• Validamos si tu perfil sostiene hoy una EB‑2 NIW u otra ruta viable.</li>
                    <li>• Definimos qué fortalecer primero para no quemar tiempo ni dinero.</li>
                    <li>• Diseñamos tus próximos 90 días con pasos concretos, no teorías.</li>
                  </ul>
                </div>
                <div className="w-full max-w-xs">
                  <VipCtaButton
                    label={ctaLabel}
                    calendarUrl={calendarUrl}
                    loading={loading}
                  />
                </div>
              </div>

              <div className="grid gap-3 text-xs text-gray-600 sm:grid-cols-2 sm:text-[13px]">
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-200">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Perfiles evaluados
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    +200 profesionales y empresarios
                  </p>
                  <p className="mt-1">
                    Personas que eligieron entender su realidad migratoria antes de apostar su
                    tiempo, dinero y familia.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-gray-200">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Enfoque de la sesión
                  </p>
                  <p className="mt-1 text-sm font-semibold text-navy">
                    Ruta migratoria, no solo requisitos
                  </p>
                  <p className="mt-1">
                    Trabajamos sobre tu proyecto, evidencias y tiempos reales, no sobre checklists
                    genéricos.
                  </p>
                </div>
              </div>

              <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2 text-[11px] text-green-900 ring-1 ring-green-100 sm:text-xs">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  <p>
                    Si en los primeros 15 minutos vemos que tu caso no encaja, te devolvemos el dinero.
                    Sin explicaciones ni discusiones: tu inversión está protegida.
                  </p>
                </div>
                <div className="text-xs text-gray-400 sm:text-[11px]">
                  Cupos limitados por semana — Ivon solo toma una cantidad reducida de diagnósticos
                  para poder profundizar en cada caso.
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-stretch justify-center"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_0_0,rgba(243,112,33,0.25),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(42,58,74,0.22),transparent_55%)] opacity-70 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] bg-white/90 p-5 shadow-2xl ring-1 ring-gray-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    <Sparkles className="h-3 w-3 text-orange" />
                    Ivon More
                  </span>
                  <span className="rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-medium text-orange ring-1 ring-orange/40">
                    Estratega migratoria MORE
                  </span>
                </div>

                <div className="mt-5 flex flex-col items-center text-center text-xs text-gray-500">
                  <div className="mb-3 h-20 w-20 rounded-3xl bg-gray-100 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    <div className="flex h-full w-full items-center justify-center">
                      Foto de Ivon
                    </div>
                  </div>
                  <p className="max-w-60 text-[11px] leading-relaxed">
                    “No todos los perfiles sostienen una Green Card, y está bien. Mi trabajo en
                    esta sesión es decirte con honestidad dónde estás y qué sí se puede construir.”
                  </p>
                </div>

                <div className="mt-5 space-y-1.5 rounded-2xl bg-gray-50 px-3 py-2.5 text-[11px] text-gray-700 ring-1 ring-gray-200/80">
                  <p className="font-semibold text-navy">
                    Qué resolvemos en estos 60 minutos:
                  </p>
                  <ul className="space-y-1.5">
                    <li>• Si tu perfil sostiene hoy una EB-2 NIW u otra ruta viable.</li>
                    <li>• Qué evidencias o logros deberías fortalecer y en qué orden.</li>
                    <li>• Qué hacer en los próximos 90 días para avanzar sin improvisar.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

