import { motion } from "framer-motion"
import { Calendar, Clock, Monitor, User } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { EventCountdown } from "@/components/brand/EventCountdown"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { TALLER_CTA_LABEL, TALLER_DATE_LABEL, TALLER_TIME_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"

const details = [
  { icon: Calendar, text: TALLER_DATE_LABEL },
  { icon: Clock, text: TALLER_TIME_LABEL },
  { icon: Monitor, text: "Virtual y en vivo" },
  { icon: User, text: "Con Ivon More" },
]

export default function TCHero() {
  const { settings } = useSiteSettings()

  return (
    <section className="relative isolate overflow-hidden bg-paper">
      <img
        src="/ivon-comunidad-hero.png"
        alt="Ivon More, fundadora de MORE"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/95 via-45% to-paper/10 to-80%" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-paper via-paper/20 to-paper/10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="max-w-xl text-center lg:text-left">
          <motion.img
            src="/logo_more_light.png"
            alt="MORE"
            className="mx-auto mb-8 h-24 sm:h-28 lg:mx-0 lg:h-32"
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
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#F37021]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
              Taller Comunidad More · En vivo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-navy-deep sm:text-4xl lg:text-5xl"
          >
            Tu trayectoria vale en Estados Unidos.{" "}
            <span className="text-[#F37021]">Diseña la ruta para demostrarlo.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            Un taller práctico para saber dónde estás hoy, qué camino te conviene y
            cuánto cuesta realmente,{" "}
            <strong className="font-semibold text-navy-deep">
              sin invertir de más ni decidir a ciegas.
            </strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start"
          >
            {details.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-ink-muted">
                <Icon className="h-4 w-4 text-orange-dark" aria-hidden />
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
              label={TALLER_CTA_LABEL}
              href="#entradas"
              onClick={scrollToEntradas}
              size="lg"
              icon={null}
              className="w-auto font-bold"
            />
            <p className="mt-3 text-xs text-ink-muted">
              Cupos limitados · Entradas General y VIP
            </p>
          </motion.div>
        </div>

        <div className="mt-10">
          <EventCountdown targetDate={settings.tc_event_date} tone="paper" />
        </div>
      </div>
    </section>
  )
}
