import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plane } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useOfferWindow } from "@/hooks/useOfferWindow"
import { TALLER_CTA_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"
import { usePriceTier } from "./priceTier"
import { DotGrid, FlightRoute } from "./TCDecor"

const flightInfo = [
  { label: "Fechas", value: "23 y 24 Nov" },
  { label: "Hora", value: "19:00 COT" },
  { label: "Modalidad", value: "Virtual en vivo" },
  { label: "Guía", value: "Ivon More" },
]

/** Un dígito del tablero: cambia con un desplazamiento vertical corto. */
function BoardDigit({ char }: { char: string }) {
  return (
    <span className="relative flex h-12 w-9 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-navy-deep sm:h-16 sm:w-12">
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-navy-ink" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "-60%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "60%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="font-mono text-2xl font-bold tabular-nums text-white sm:text-4xl"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function BoardUnit({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("")
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((d, i) => (
          <BoardDigit key={i} char={d} />
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-soft">{label}</span>
    </div>
  )
}

/** Contador con estética de tablero de salidas de aeropuerto. */
function DepartureBoard({ targetDate }: { targetDate: string }) {
  const { timeLeft, expired } = useOfferWindow(targetDate)
  if (!timeLeft && !expired) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-ink/80 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-[11px] font-bold uppercase tracking-[0.18em]">
        <span className="flex items-center gap-2 text-navy-soft">
          <Plane className="h-3.5 w-3.5 text-orange" aria-hidden />
          Salida · MORE 2311 · Destino: tu ruta en EE.UU.
        </span>
        <span className={expired ? "text-navy-soft" : "text-orange"}>
          {expired ? "En curso" : "A tiempo"}
        </span>
      </div>
      {timeLeft ? (
        <div className="flex items-start justify-center gap-2 sm:gap-4">
          <BoardUnit value={timeLeft.days} label="Días" />
          <span className="pt-3 font-mono text-2xl text-navy-line sm:pt-4 sm:text-3xl">:</span>
          <BoardUnit value={timeLeft.hours} label="Horas" />
          <span className="pt-3 font-mono text-2xl text-navy-line sm:pt-4 sm:text-3xl">:</span>
          <BoardUnit value={timeLeft.minutes} label="Min" />
          <span className="pt-3 font-mono text-2xl text-navy-line sm:pt-4 sm:text-3xl">:</span>
          <BoardUnit value={timeLeft.seconds} label="Seg" />
        </div>
      ) : (
        <p className="text-center text-sm text-navy-pale">El taller ya despegó.</p>
      )}
    </div>
  )
}

export default function TCHero() {
  const { settings } = useSiteSettings()
  const tier = usePriceTier()

  return (
    <section className="relative isolate overflow-hidden bg-navy-ink text-white">
      <DotGrid />
      <FlightRoute className="absolute inset-x-0 top-3 -z-0 sm:top-5" duration={8} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pt-36 lg:px-8 lg:pb-20 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <motion.img
              src="/logo_more_dark.png"
              alt="MORE — Migración con propósito"
              className="mx-auto -my-6 mb-2 h-28 w-auto sm:h-32 lg:mx-0 lg:-ml-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                En vivo · Taller Comunidad More
              </span>
            </motion.div>
            {tier === "comunidad" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="ml-2 mt-2 inline-flex items-center rounded-full bg-orange px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white sm:mt-0"
              >
                Precio exclusivo · Comunidad More
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 font-sans text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
            >
              Tu trayectoria vale en Estados Unidos.{" "}
              <span className="text-orange">Diseña tu ruta.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-navy-pale sm:text-lg lg:mx-0"
            >
              Dos noches en vivo. El <strong className="font-semibold text-white">lunes 23</strong> diseñas tu ruta si
              empiezas de cero; el <strong className="font-semibold text-white">martes 24</strong> destrabas tu proceso si
              ya iniciaste o lo haces solo. Sin invertir de más ni decidir a ciegas.
            </motion.p>

            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="mx-auto mt-8 grid max-w-xl grid-cols-2 divide-white/10 overflow-hidden rounded-xl border border-white/10 sm:grid-cols-4 sm:divide-x lg:mx-0"
            >
              {flightInfo.map(({ label, value }) => (
                <div key={label} className="px-4 py-3 text-left">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-soft">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center"
            >
              <CtaButton
                label={TALLER_CTA_LABEL}
                href="#entradas"
                onClick={scrollToEntradas}
                size="lg"
                icon={ArrowRight}
                className="w-auto flex-row-reverse font-bold"
              />
              <a
                href="#ruta"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("ruta")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="text-sm font-semibold text-navy-pale underline-offset-4 hover:text-white hover:underline"
              >
                Ver la ruta del taller
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <img
                src="/ivon.png"
                alt="Ivon More, fundadora de MORE"
                className="aspect-square w-full object-cover object-[50%_85%]"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 right-8 rounded-2xl border border-navy/10 bg-white p-4 text-navy-deep shadow-xl sm:-left-10">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                <span>Pase de abordar</span>
                <span className="text-orange-dark">MORE 2311</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div>
                  <p className="font-sans text-2xl font-extrabold tracking-tight leading-none">HOY</p>
                  <p className="mt-1 text-[11px] text-ink-muted">Tu punto de partida</p>
                </div>
                <div className="flex flex-1 items-center gap-1 text-orange" aria-hidden>
                  <span className="h-px flex-1 border-t-2 border-dotted border-navy-line" />
                  <Plane className="h-4 w-4" />
                  <span className="h-px flex-1 border-t-2 border-dotted border-navy-line" />
                </div>
                <div className="text-right">
                  <p className="font-sans text-2xl font-extrabold tracking-tight leading-none text-orange">EE.UU.</p>
                  <p className="mt-1 text-[11px] text-ink-muted">Tu ruta clara</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 lg:mt-20">
          <DepartureBoard targetDate={settings.tc_event_date} />
        </div>
      </div>
    </section>
  )
}
