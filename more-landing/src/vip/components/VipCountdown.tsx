import { memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Clock } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { OfferTimeLeft } from "@/hooks/useOfferWindow"

const FlipNumber = memo(function FlipNumber({ value }: { value: number }) {
  const formatted = String(value).padStart(2, "0")
  return (
    <div className="relative flex h-10 items-center overflow-hidden sm:h-12">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={formatted}
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 28, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-display text-3xl font-bold tabular-nums leading-none text-white sm:text-4xl"
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </div>
  )
})

const Block = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 sm:h-16 sm:w-16">
      <FlipNumber value={value} />
    </div>
    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
      {label}
    </span>
  </div>
)

type VipCountdownProps = {
  timeLeft: OfferTimeLeft
}

export const VipCountdown = ({ timeLeft }: VipCountdownProps) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-navy-deep px-5 py-5 shadow-lg shadow-navy/20 sm:px-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-white">
            <Clock className="h-4.5 w-4.5" aria-hidden />
          </span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-light">
              {t("vipPage.countdown.eyebrow")}
            </p>
            <p className="mt-0.5 font-sans text-sm text-white/75">
              {t("vipPage.countdown.subline")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:gap-4">
          {/* La oferta VIP se cuenta en horas totales, no en días */}
          <Block value={timeLeft.totalHours} label={t("vipPage.countdown.hours")} />
          <span className="font-display text-2xl text-white/30 sm:mt-3">:</span>
          <Block value={timeLeft.minutes} label={t("vipPage.countdown.minutes")} />
          <span className="font-display text-2xl text-white/30 sm:mt-3">:</span>
          <Block value={timeLeft.seconds} label={t("vipPage.countdown.seconds")} />
        </div>
      </div>
    </div>
  )
}
