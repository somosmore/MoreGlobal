import { memo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

/** Reloj de la sala: anillo de progreso y dígitos que giran. */

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const URGENT_AT = 10

const Segment = memo(function Segment({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")
  return (
    <span className="relative inline-flex items-center">
      {/* Solo animación de entrada: con la pestaña en segundo plano una salida
          animada puede quedar a medias y acumular dígitos. */}
      <motion.span
        key={formatted}
        initial={{ y: "-28%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="tabular-nums"
      >
        {formatted}
      </motion.span>
    </span>
  )
})

export function ClockRing({ remaining, total }: { remaining: number; total: number }) {
  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const fraction = total > 0 ? remaining / total : 0
  const urgent = remaining <= URGENT_AT && remaining > 0

  return (
    <div className="relative grid aspect-square w-[min(84vw,30rem)] place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#F37021"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE.toFixed(2)}
          strokeDashoffset={(CIRCUMFERENCE * (1 - fraction)).toFixed(2)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <motion.div
        role="timer"
        aria-live="off"
        animate={urgent ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={urgent ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        className={cn(
          "flex items-center text-[clamp(2.25rem,8.5vw,4.75rem)] font-extrabold leading-none tracking-tight",
          urgent ? "text-orange" : "text-white",
        )}
      >
        <Segment value={minutes} />
        <span className="px-[0.06em] text-white/50">:</span>
        <Segment value={seconds} />
      </motion.div>
      <span className="sr-only">{`Faltan ${minutes} minutos y ${seconds} segundos`}</span>
    </div>
  )
}
