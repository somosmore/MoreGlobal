import { useState, useEffect, useMemo, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

type BlockVariant = "default" | "accent" | "hot"

const blockStyles: Record<BlockVariant, string> = {
  default: "bg-white/10 border-white/20 text-white backdrop-blur-sm",
  accent: "bg-orange/20 border-orange/40 text-white backdrop-blur-sm",
  hot: "bg-gradient-to-br from-orange to-orange-dark border-orange/60 text-white shadow-[0_0_22px_rgba(243,112,33,0.5)]",
}

const labelStyles: Record<BlockVariant, string> = {
  default: "text-white/50",
  accent: "text-orange/80",
  hot: "text-orange font-semibold",
}

const numberOverride: Record<BlockVariant, string> = {
  default: "text-white",
  accent: "text-white",
  hot: "text-white",
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
        className={`w-16 sm:w-20 h-16 sm:h-20 rounded-xl border flex items-center justify-center transition-shadow duration-300 ${blockStyles[variant]}`}
      >
        <div className="relative h-9 overflow-hidden flex items-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={String(value).padStart(2, "0")}
              initial={{ y: -30, opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${numberOverride[variant]}`}
            >
              {String(value).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <span className={`mt-2 text-[10px] sm:text-xs uppercase tracking-widest ${labelStyles[variant]}`}>
        {label}
      </span>
    </div>
  )
})

type UppCountdownProps = {
  targetDate: string
}

export function UppCountdown({ targetDate }: UppCountdownProps) {
  const { t } = useTranslation()

  const target = useMemo(() => (targetDate ? new Date(targetDate) : null), [targetDate])
  const [timeLeft, setTimeLeft] = useState(() => (target ? getTimeLeft(target) : null))

  useEffect(() => {
    if (!target) return
    const id = setInterval(() => {
      const tl = getTimeLeft(target)
      setTimeLeft(tl)
      if (!tl) clearInterval(id)
    }, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!timeLeft) return null

  const labels = { d: "Días", h: "Horas", m: "Min", s: "Seg" }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-6"
    >
      <p className="text-xs sm:text-sm text-white/50 uppercase tracking-widest mb-4 text-center font-semibold">
        {t("uppPage.hero.countdownLabel")}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label={labels.d} variant="default" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.hours} label={labels.h} variant="default" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.minutes} label={labels.m} variant="accent" />
        <span className="text-xl font-bold text-orange -mt-6 drop-shadow-[0_0_6px_rgba(243,112,33,0.6)]">:</span>
        <Block value={timeLeft.seconds} label={labels.s} variant="hot" />
      </div>
    </motion.div>
  )
}
