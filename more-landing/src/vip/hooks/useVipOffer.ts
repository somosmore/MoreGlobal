import { useEffect, useState } from "react"

export type VipTimeLeft = {
  hours: number
  minutes: number
  seconds: number
}

export type VipOfferState = {
  /** Hay una fecha de cierre configurada y todavía no llegó. */
  active: boolean
  /** Hay una fecha de cierre configurada y ya pasó: la página queda cerrada. */
  expired: boolean
  timeLeft: VipTimeLeft | null
}

function computeTimeLeft(deadline: number, now: number): VipTimeLeft | null {
  const diff = deadline - now
  if (diff <= 0) return null
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

/**
 * Traduce `vip_countdown_date` (site_settings) al estado de la oferta.
 * Sin fecha configurada, la página se comporta como siempre disponible.
 */
export function useVipOffer(countdownDate?: string | null): VipOfferState {
  const raw = countdownDate?.trim() ?? ""
  const parsed = raw ? new Date(raw).getTime() : Number.NaN
  const deadline = Number.isNaN(parsed) ? null : parsed

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!deadline) return

    const id = setInterval(() => {
      const current = Date.now()
      setNow(current)
      if (current >= deadline) clearInterval(id)
    }, 1000)

    return () => clearInterval(id)
  }, [deadline])

  if (!deadline) {
    return { active: false, expired: false, timeLeft: null }
  }

  const timeLeft = computeTimeLeft(deadline, now)

  return {
    active: timeLeft !== null,
    expired: timeLeft === null,
    timeLeft,
  }
}
