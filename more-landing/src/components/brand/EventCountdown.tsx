import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useOfferWindow } from "@/hooks/useOfferWindow"

const FlipNumber = memo(function FlipNumber({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")
  return (
    <div className="relative flex h-9 items-center overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={formatted}
          initial={{ y: -30, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-display text-2xl font-bold leading-none tabular-nums sm:text-3xl"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  )
})

type BlockVariant = "default" | "accent" | "hot"

const blockStyles: Record<BlockVariant, string> = {
  default: "border-white/20 bg-white/10 text-white",
  accent: "border-orange/40 bg-orange/20 text-orange-light",
  hot: "border-orange/80 bg-orange text-white shadow-lg shadow-orange/40",
}

const labelStyles: Record<BlockVariant, string> = {
  default: "text-white/50",
  accent: "text-orange-light/80",
  hot: "font-semibold text-orange-light",
}

const Block = memo(function Block({
  value,
  label,
  variant = "default",
}: {
  value: number
  label: string
  variant?: BlockVariant
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-xl border backdrop-blur-sm transition-shadow duration-300 sm:h-20 sm:w-20 ${blockStyles[variant]}`}
      >
        <FlipNumber value={value} />
      </div>
      <span
        className={`mt-2 text-[10px] uppercase tracking-widest sm:text-xs ${labelStyles[variant]}`}
      >
        {label}
      </span>
    </div>
  )
})

type EventCountdownProps = {
  /** Fecha del evento (site_settings). Vacía o pasada: no se renderiza nada. */
  targetDate?: string | null
  intro?: string
  className?: string
}

/**
 * Cuenta regresiva de las landings de campaña (masterclass, taller).
 * La fecha llega desde site_settings: no se hardcodea en el código.
 */
export const EventCountdown = ({
  targetDate,
  intro = "Comienza en",
  className,
}: EventCountdownProps) => {
  const { timeLeft } = useOfferWindow(targetDate)

  if (!timeLeft) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className={className ?? "mt-8"}
    >
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-white/50 sm:text-sm">
        {intro}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label="Días" />
        <span className="-mt-6 text-2xl font-bold text-white/30">:</span>
        <Block value={timeLeft.hours} label="Horas" />
        <span className="-mt-6 text-2xl font-bold text-white/30">:</span>
        <Block value={timeLeft.minutes} label="Minutos" variant="accent" />
        <span className="-mt-6 text-xl font-bold text-orange">:</span>
        <Block value={timeLeft.seconds} label="Segundos" variant="hot" />
      </div>
    </motion.div>
  )
}
