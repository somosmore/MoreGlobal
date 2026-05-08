import { useState, useEffect, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"

const EVENT_DATE = new Date("2026-05-25T19:00:00-05:00")

function getTimeLeft() {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const FlipNumber = memo(function FlipNumber({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")
  return (
    <div className="relative h-9 overflow-hidden flex items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={formatted}
          initial={{ y: -30, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl sm:text-3xl font-bold tabular-nums leading-none"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  )
})

type BlockVariant = "default" | "accent" | "hot"

const blockStyles: Record<BlockVariant, string> = {
  default:
    "bg-white/10 border-white/20 text-white",
  accent:
    "bg-[#F37021]/20 border-[#F37021]/40 text-[#FFBA7A]",
  hot:
    "bg-gradient-to-br from-[#F37021] to-[#C9570F] border-[#F37021]/80 text-white shadow-[0_0_22px_rgba(243,112,33,0.65)]",
}

const labelStyles: Record<BlockVariant, string> = {
  default: "text-white/50",
  accent: "text-[#FFBA7A]/80",
  hot: "text-[#FFBA7A] font-semibold",
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
        className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl border flex items-center justify-center backdrop-blur-sm transition-shadow duration-300 ${blockStyles[variant]}`}
      >
        <FlipNumber value={value} />
      </div>
      <span
        className={`mt-2 text-[10px] sm:text-xs uppercase tracking-widest ${labelStyles[variant]}`}
      >
        {label}
      </span>
    </div>
  )
})

export default function MCCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft()
      setTimeLeft(t)
      if (!t) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className="mt-8"
    >
      <p className="text-xs sm:text-sm text-white/50 uppercase tracking-widest mb-4 text-center">
        Comienza en
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label="Días" variant="default" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.hours} label="Horas" variant="default" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.minutes} label="Min" variant="accent" />
        <span className="text-xl font-bold text-[#F37021] -mt-6 drop-shadow-[0_0_6px_rgba(243,112,33,0.8)]">
          :
        </span>
        <Block value={timeLeft.seconds} label="Seg" variant="hot" />
      </div>
    </motion.div>
  )
}
