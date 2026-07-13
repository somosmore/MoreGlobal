import { useEffect, useState } from "react"

export type OfferTimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Horas totales (sin descontar días): lo usa el contador de la oferta VIP. */
  totalHours: number
}

export type OfferWindowState = {
  /** Hay una fecha configurada y todavía no llegó. */
  active: boolean
  /** Hay una fecha configurada y ya pasó. */
  expired: boolean
  timeLeft: OfferTimeLeft | null
}

function computeTimeLeft(deadline: number, now: number): OfferTimeLeft | null {
  const diff = deadline - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    totalHours: Math.floor(diff / (1000 * 60 * 60)),
  }
}

/**
 * Cuenta regresiva hacia una fecha que vive en `site_settings`
 * (por ejemplo `vip_countdown_date` o `tn_event_date`).
 * Sin fecha configurada, la ventana se considera siempre abierta.
 *
 * `Date.now()` no puede llamarse en render (regla react-hooks), así que el
 * tiempo actual vive en estado y lo refresca un intervalo.
 */
export function useOfferWindow(date?: string | null): OfferWindowState {
  const raw = date?.trim() ?? ""
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
