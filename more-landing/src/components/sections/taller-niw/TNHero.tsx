import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Gift, User } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { EventCountdown } from "@/components/brand/EventCountdown"
import { Backdrop } from "@/components/brand/Backdrop"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { scrollToRegistro } from "./scrollToRegistro"

const details = [
  { icon: Calendar, text: "Jueves 30 de julio 2026" },
  { icon: Clock, text: "7:00 PM (hora Colombia)" },
  { icon: MapPin, text: "En línea y en vivo" },
  { icon: Gift, text: "100% gratis" },
  { icon: User, text: "Con Ivon More" },
]

/** Porcentaje de cupos ocupados que muestra la barra de urgencia. */
const CUPOS_PCT = 82
// TODO: reemplazar por la cifra real de registrados antes de publicar.
const REGISTRANTS_COUNT = 1200

export default function TNHero() {
  const { settings } = useSiteSettings()

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-paper">

      <Backdrop variant="hero" className="opacity-70" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.img
              src="/logo_more_light.png"
              alt="MORE"
              className="mx-auto mb-8 h-28 sm:h-32 lg:mx-0 lg:h-36"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange-wash px-4 py-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#F37021] animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
                Taller gratuito en vivo
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-navy-deep sm:text-4xl lg:text-5xl"
            >
              Cómo convertirte en el{" "}
              <span className="text-[#F37021]">profesional que todo país desea</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Descubre cómo posicionar tu trayectoria profesional para que tu perfil
              sea reconocido como de alto impacto — el tipo de profesional que un
              país quiere atraer y retener.{" "}
              <strong className="font-semibold text-navy-deep">
                Un taller en vivo para clarificar tu ruta migratoria con estrategia.
              </strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3"
            >
              {details.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <Icon className="h-4 w-4 text-orange-dark" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8"
            >
              <CtaButton
                label="Sí, quiero mi lugar en el taller"
                href="#registro"
                onClick={scrollToRegistro}
                size="lg"
                icon={null}
                className="w-auto font-bold"
              />
              <p className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-muted lg:justify-start">
                <Gift className="h-3.5 w-3.5 text-orange-dark" />
                Gratis · En vivo · Cupos limitados
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-6 max-w-xs mx-auto lg:mx-0"
            >
              <div className="mb-2 flex items-center justify-between text-xs text-ink-muted">
                <span>Cupos ocupados</span>
                <span className="font-semibold text-orange-dark">{CUPOS_PCT}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-navy/10">
                <motion.div
                  className="h-full rounded-full bg-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${CUPOS_PCT}%` }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Prueba social */}
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-7 w-7 rounded-full border-2 border-paper bg-orange"
                    />
                  ))}
                </div>
                <p className="text-xs text-ink-muted">
                  <span className="font-bold text-navy-deep">
                    +{REGISTRANTS_COUNT.toLocaleString("es")}
                  </span>{" "}
                  profesionales ya reservaron
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Speaker image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative shrink-0 w-64 sm:w-72 lg:w-80 xl:w-96"
          >
            <div className="relative">
              <img
                src="/ivon.png"
                alt="Ivon More — Fundadora de MORE"
                className="relative w-full rounded-2xl border border-navy/15 object-cover shadow-xl"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4 text-center"
            >
              <p className="text-lg font-bold text-navy-deep">Ivon More</p>
              <p className="text-sm font-medium text-orange-dark">
                Fundadora de MORE — Migración con Propósito
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Countdown — full width below the split */}
        <EventCountdown targetDate={settings.tn_event_date} tone="paper" />
      </div>
    </section>
  )
}
