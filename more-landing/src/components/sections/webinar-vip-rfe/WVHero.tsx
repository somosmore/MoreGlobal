import { motion } from "framer-motion"
import { CalendarDays, Clock, Crown, Video } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { EventCountdown } from "@/components/brand/EventCountdown"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { DotGrid } from "@/components/sections/taller-nov-26/TCDecor"
import { WV_CTA_LABEL, WV_TITLE, eventDateParts } from "./webinarVipRfeCopy"
import { scrollToRegistro } from "./scrollToRegistro"

export default function WVHero() {
  const { settings } = useSiteSettings()
  const fecha = eventDateParts(settings.wv_event_date)

  const datos = [
    { icon: CalendarDays, label: "Fecha", value: fecha?.day ?? "Por confirmar" },
    { icon: Clock, label: "Hora", value: fecha ? `${fecha.time} (Colombia)` : "Por confirmar" },
    { icon: Video, label: "Modalidad", value: "En vivo y virtual" },
  ]

  return (
    <section className="relative isolate overflow-hidden bg-navy-ink text-white">
      <DotGrid />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28 lg:pb-20">
        <motion.img
          src="/logo_more_dark.png"
          alt="MORE — Migración con propósito"
          className="mx-auto -my-6 mb-2 h-28 w-auto sm:h-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange/40 bg-orange/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-orange">
            <Crown className="h-3.5 w-3.5" aria-hidden />
            Exclusivo Comunidad More · En vivo
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-sans text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            {WV_TITLE}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-navy-pale sm:text-lg">
            Qué está pidiendo USCIS hoy en los RFE, cómo prepararte desde ya, qué hacer cuando te
            aprueban la I-140 y cómo avanzar tu proyecto mientras esperas la visa. Con Ivon More.
          </p>
        </motion.div>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-3">
          {datos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-navy-soft">
                <Icon className="h-3.5 w-3.5 text-orange" aria-hidden />
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold first-letter:uppercase text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <EventCountdown targetDate={settings.wv_event_date} intro="Empezamos en" tone="dark" />
        </div>

        <div className="mx-auto mt-8 flex max-w-sm flex-col items-center gap-3">
          <CtaButton label={WV_CTA_LABEL} onClick={(e) => scrollToRegistro(e)} size="lg" icon={null} className="font-bold" />
          {settings.wv_general_price && (
            <p className="text-sm text-navy-pale">
              Entradas General y VIP desde <span className="font-bold text-white">{settings.wv_general_price}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
