import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Clock,
  Eye,
  FileText,
  Lock,
  MessageCircle,
  Package,
  Sparkles,
  Users,
  Video,
} from "lucide-react"
import { VipCtaButton } from "./VipCtaButton"
import { cn } from "@/lib/utils"

type VipHeroProps = {
  calendarUrl?: string | null
  loading?: boolean
}

const VIP_VIEWERS_MIN = 87
const VIP_VIEWERS_MAX = 500

export const VipHero = ({ calendarUrl, loading }: VipHeroProps) => {
  const ctaLabel = "Aplicar ahora"

  const viewersCount = useMemo(
    () =>
      Math.floor(Math.random() * (VIP_VIEWERS_MAX - VIP_VIEWERS_MIN + 1)) + VIP_VIEWERS_MIN,
    [],
  )

  const pricePanelBase =
    "relative overflow-hidden rounded-2xl bg-linear-to-br from-orange via-orange to-orange-dark p-6 text-white shadow-xl shadow-orange/35 ring-1 ring-orange-dark/30"

  const pricePanelLinkExtra =
    "vip-price-card-shine block transition-transform duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange/40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-dark"

  const pricePanelInner = (
    <>
      <p
        className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/90"
        data-vip-eyebrow="true"
      >
        Inversión única
      </p>
      <p className="mt-2 flex items-baseline justify-center gap-1.5">
        <span className="text-5xl font-bold tracking-tight sm:text-[3.25rem]">$97</span>
        <span className="font-sans text-lg font-semibold text-white/95">USD</span>
      </p>
      <p className="mt-2 text-center font-sans text-xs leading-snug text-white/85">
        Sesión privada · sin mensualidades · aplicá y elegí tu horario
      </p>
      <div className="mt-4 h-px w-full bg-white/25" />
      <p className="mt-3 text-center font-sans text-[11px] font-medium text-white/90">
        Menos que un trámite mal hecho te puede costar después.
      </p>
    </>
  )

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-linear-to-br from-white via-gray-50/50 to-navy/3 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-navy/[0.07] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/3 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="space-y-5"
            >
              <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl">
                Asegura tu Residencia en{" "}
                <span className="bg-linear-to-r from-orange to-orange-dark bg-clip-text text-transparent">
                  EE.UU.
                </span>{" "}
                con el Máximo Estándar de Precisión.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
                En esta página aplicás a una sesión VIP de 60 minutos donde validamos con datos si
                hoy tiene sentido apostar por tu Green Card o cuidar tu inversión para más adelante.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-5"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-orange/35 bg-linear-to-br from-white via-white to-orange/[0.07] p-6 shadow-[0_24px_60px_-16px_rgba(42,58,74,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-navy/5 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange/20 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-navy/8 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute right-6 top-6 hidden h-14 w-14 rounded-full border border-orange/20 bg-orange/10 sm:block"
                  aria-hidden
                />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-10">
                  <div className="min-w-0 flex-1 space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full bg-orange px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-md shadow-orange/25"
                        data-vip-eyebrow="true"
                      >
                        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        Asesoría 1 a 1
                      </span>
                      <span
                        className="rounded-full bg-navy/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                        data-vip-eyebrow="true"
                      >
                        Oferta de entrada
                      </span>
                    </div>

                    <h2 className="text-balance text-[clamp(1.65rem,4vw,2.35rem)] font-semibold leading-[1.15] text-navy">
                      Sesión privada con Ivon:{" "}
                      <span className="text-orange-dark">vos y nadie más</span> en la llamada
                    </h2>

                    <p className="max-w-xl font-sans text-base leading-relaxed text-gray-600 sm:text-[17px]">
                      En esta hora no venís a escuchar teoría: decidís con números, riesgos y escenarios
                      reales. Atención dedicada, como una consulta de alto nivel, no un webinar
                      grabado.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Users className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            Formato
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">1 a 1 en vivo</p>
                        </div>
                      </div>
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Clock className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            Duración
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">60 minutos</p>
                        </div>
                      </div>
                      <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl border border-navy/10 bg-white/90 px-4 py-3 shadow-sm ring-1 ring-white">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Lock className="h-5 w-5" aria-hidden />
                        </div>
                        <div>
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-gray-500"
                            data-vip-eyebrow="true"
                          >
                            Privacidad
                          </p>
                          <p className="font-sans text-sm font-semibold text-navy">100% confidencial</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5 rounded-2xl border border-orange/20 bg-linear-to-b from-white/90 to-orange/5 p-4 ring-1 ring-navy/5 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2 border-b border-orange/15 pb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange/12 text-orange">
                          <Package className="h-5 w-5" aria-hidden />
                        </div>
                        <p className="font-sans text-base font-bold text-navy sm:text-lg">
                          Lo que recibís — Asesoría VIP{" "}
                          <span className="text-orange-dark">$97</span>
                        </p>
                      </div>

                      <div>
                        <p
                          className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500"
                          data-vip-eyebrow="true"
                        >
                          Durante la sesión
                        </p>
                        <p className="mt-1 font-sans text-sm font-medium text-navy">
                          60 min en vivo con Ivon
                        </p>
                        <ul className="mt-3 space-y-2.5 font-sans text-sm text-gray-800 sm:text-[15px]">
                          {[
                            "Análisis de perfil profesional y empresarial.",
                            "Evaluación de elegibilidad para EB-2 NIW u otros programas.",
                            "Identificación de puntos débiles y cómo resolverlos.",
                            "Definición del programa migratorio más conveniente.",
                          ].map((line) => (
                            <li key={line} className="flex gap-3">
                              <span
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-sm"
                                aria-hidden
                              >
                                <Check className="h-4 w-4 stroke-3" />
                              </span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p
                          className="font-sans text-[11px] font-bold uppercase tracking-wider text-gray-500"
                          data-vip-eyebrow="true"
                        >
                          Después de la sesión
                        </p>
                        <ul className="mt-3 space-y-3 font-sans text-sm text-gray-800 sm:text-[15px]">
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <Video className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">Grabación completa</span> de
                              la sesión, para revisar cuando quieras.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <FileText className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">PDF personalizado</span> con
                              tu ruta migratoria y plan de acción para los próximos 90 días.
                            </span>
                          </li>
                          <li className="flex gap-3">
                            <span
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-navy/10 text-navy"
                              aria-hidden
                            >
                              <MessageCircle className="h-4 w-4" />
                            </span>
                            <span>
                              <span className="font-semibold text-navy">Seguimiento por WhatsApp</span>{" "}
                              post-sesión.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full shrink-0 flex-col justify-between gap-6 lg:w-[min(100%,280px)]">
                    {!loading && calendarUrl ? (
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(pricePanelBase, pricePanelLinkExtra)}
                        aria-label={`${ctaLabel} — inversión única $97 USD`}
                      >
                        <div className="relative z-10">{pricePanelInner}</div>
                      </a>
                    ) : (
                      <div
                        className={cn(pricePanelBase, "cursor-not-allowed", loading && "animate-pulse")}
                        aria-hidden={loading}
                      >
                        <div className="relative z-10">{pricePanelInner}</div>
                      </div>
                    )}
                    <div className="w-full">
                      <VipCtaButton
                        label={ctaLabel}
                        calendarUrl={calendarUrl}
                        loading={loading}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="mx-auto max-w-2xl py-8 text-center font-sans text-xs leading-relaxed text-gray-500 sm:py-10 sm:text-sm">
                Solo para personas dispuestas a tomar una decisión real en los próximos 90 días.
              </p>

              <div className="grid gap-4 text-xs text-gray-600 sm:grid-cols-2 sm:text-[13px]">
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
            </motion.div>
          </div>
        </div>
        <div className="mt-8 flex justify-center px-2 sm:mt-10">
          <div className="flex w-full max-w-xl flex-col items-center gap-3 rounded-2xl border-2 border-orange/45 bg-linear-to-b from-orange/15 to-orange/8 px-5 py-6 text-center shadow-lg shadow-orange/15 sm:px-8 sm:py-8">
            <div className="flex items-center gap-2 text-orange-dark">
              <Eye className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" aria-hidden />
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-navy/70">
                Actividad en vivo
              </span>
            </div>
            <p className="font-sans text-navy">
              <span className="block text-3xl font-black tabular-nums tracking-tight text-orange-dark sm:text-4xl md:text-5xl">
                {viewersCount}
              </span>
              <span className="mt-2 block text-base font-extrabold uppercase leading-snug tracking-tight sm:text-lg md:text-xl">
                personas están viendo esta sesión ahora
              </span>
            </p>
            <p className="max-w-md font-sans text-xs font-medium text-navy/75 sm:text-sm">
              Cupos limitados: mucha gente está evaluando el mismo tipo de asesoría en este momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

