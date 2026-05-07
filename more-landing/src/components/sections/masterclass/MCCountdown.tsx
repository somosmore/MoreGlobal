import { useState, useEffect } from "react"
import { motion } from "framer-motion"

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

type TimeBlock = { value: number; label: string }

function Block({ value, label }: TimeBlock) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">
        {label}
      </span>
    </div>
  )
}

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
      className="mt-10"
    >
      <p className="text-xs sm:text-sm text-white/50 uppercase tracking-widest mb-4">
        Comienza en
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label="Días" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.hours} label="Horas" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.minutes} label="Min" />
        <span className="text-2xl font-bold text-white/30 -mt-6">:</span>
        <Block value={timeLeft.seconds} label="Seg" />
      </div>
    </motion.div>
  )
}
