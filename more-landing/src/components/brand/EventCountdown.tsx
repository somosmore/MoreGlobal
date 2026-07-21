import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
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
type CountdownTone = "dark" | "paper"

const blockStyles: Record<CountdownTone, Record<BlockVariant, string>> = {
  dark: {
    default: "border-white/20 bg-white/10 text-white",
    accent: "border-orange/40 bg-orange/20 text-orange-light",
    hot: "border-orange/80 bg-orange text-white shadow-lg shadow-orange/40",
  },
  paper: {
    default: "border-navy/15 bg-white text-navy-deep shadow-sm",
    accent: "border-orange/30 bg-paper-warm text-navy-deep shadow-sm",
    hot: "border-orange bg-orange text-white shadow-md shadow-orange/20",
  },
}

const labelStyles: Record<CountdownTone, Record<BlockVariant, string>> = {
  dark: {
    default: "text-white/50",
    accent: "text-orange-light/80",
    hot: "font-semibold text-orange-light",
  },
  paper: {
    default: "text-ink-muted",
    accent: "text-orange-dark",
    hot: "font-semibold text-orange-dark",
  },
}

const Block = memo(function Block({
  value,
  label,
  variant = "default",
  tone,
}: {
  value: number
  label: string
  variant?: BlockVariant
  tone: CountdownTone
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-xl border transition-shadow duration-300 sm:h-20 sm:w-20 ${blockStyles[tone][variant]}`}
      >
        <FlipNumber value={value} />
      </div>
      <span
        className={`mt-2 text-[10px] uppercase tracking-widest sm:text-xs ${labelStyles[tone][variant]}`}
      >
        {label}
      </span>
    </div>
  )
})

type EventCountdownProps = {
  targetDate?: string | null
  intro?: string
  className?: string
  tone?: CountdownTone
}

export const EventCountdown = ({
  targetDate,
  intro,
  className,
  tone = "dark",
}: EventCountdownProps) => {
  const { t } = useTranslation()
  const { timeLeft } = useOfferWindow(targetDate)

  if (!timeLeft) return null

  const copy = {
    intro: intro ?? t("countdown.startsIn"),
    days: t("countdown.days"),
    hours: t("countdown.hours"),
    minutes: t("countdown.minutes"),
    seconds: t("countdown.seconds"),
  }
  const separatorClass = tone === "paper" ? "text-navy/30" : "text-white/30"
  const hotSeparatorClass = tone === "paper" ? "text-orange-dark" : "text-orange"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45 }}
      className={className ?? "mt-8"}
    >
      <p
        className={`mb-4 text-center text-xs uppercase tracking-widest sm:text-sm ${tone === "paper" ? "text-ink-muted" : "text-white/50"}`}
      >
        {copy.intro}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <Block value={timeLeft.days} label={copy.days} tone={tone} />
        <span className={`-mt-6 text-2xl font-bold ${separatorClass}`}>:</span>
        <Block value={timeLeft.hours} label={copy.hours} tone={tone} />
        <span className={`-mt-6 text-2xl font-bold ${separatorClass}`}>:</span>
        <Block
          value={timeLeft.minutes}
          label={copy.minutes}
          variant="accent"
          tone={tone}
        />
        <span className={`-mt-6 text-xl font-bold ${hotSeparatorClass}`}>:</span>
        <Block
          value={timeLeft.seconds}
          label={copy.seconds}
          variant="hot"
          tone={tone}
        />
      </div>
    </motion.div>
  )
}
