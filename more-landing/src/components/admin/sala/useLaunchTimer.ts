import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Temporizador de la sala de espera (portado de la sala de MORE-WEBINAR-EB2-NIW).
 * Cuenta una duración elegida a mano y recalcula contra un instante final
 * absoluto, así una pestaña en segundo plano no se atrasa.
 * Atajos de prueba en la URL: `?seg=90` (segundos exactos) o `?min=5`.
 */

export type LaunchPhase = "idle" | "running" | "done"

export const MIN_MINUTES = 1
export const MAX_MINUTES = 180
const STORAGE_KEY = "more-sala-minutes"
const TICK_MS = 250

export const clampMinutes = (value: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(value))) : fallback

function readInitialSeconds(defaultMinutes: number): number {
  const params = new URLSearchParams(window.location.search)
  const seg = Number(params.get("seg"))
  if (Number.isFinite(seg) && seg > 0) return Math.round(seg)
  const min = Number(params.get("min"))
  if (Number.isFinite(min) && min > 0) return clampMinutes(min, defaultMinutes) * 60
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY))
    if (saved) return clampMinutes(saved, defaultMinutes) * 60
  } catch {
    // Storage bloqueado: default.
  }
  return defaultMinutes * 60
}

export function useLaunchTimer(defaultMinutes: number) {
  const [seconds, setSeconds] = useState(() => readInitialSeconds(defaultMinutes))
  const [phase, setPhase] = useState<LaunchPhase>("idle")
  const [ticking, setTicking] = useState(0)
  const [total, setTotal] = useState(seconds)
  const endAtRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const stopTicking = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = undefined
  }, [])

  useEffect(() => stopTicking, [stopTicking])

  const setMinutes = useCallback(
    (value: number) => {
      const minutes = clampMinutes(value, defaultMinutes)
      setSeconds(minutes * 60)
      try {
        window.localStorage.setItem(STORAGE_KEY, String(minutes))
      } catch {
        // Sin persistencia funciona igual.
      }
    },
    [defaultMinutes],
  )

  const start = useCallback(() => {
    stopTicking()
    endAtRef.current = Date.now() + seconds * 1000 + 250
    setTotal(seconds)
    setTicking(seconds)
    setPhase("running")
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000))
      setTicking(left)
      if (left <= 0) {
        stopTicking()
        setPhase("done")
      }
    }, TICK_MS)
  }, [seconds, stopTicking])

  const reset = useCallback(() => {
    stopTicking()
    setPhase("idle")
  }, [stopTicking])

  const restart = useCallback(() => {
    reset()
    start()
  }, [reset, start])

  return {
    phase,
    minutes: Math.max(MIN_MINUTES, Math.round(seconds / 60)),
    setMinutes,
    remaining: phase === "idle" ? seconds : ticking,
    total: phase === "idle" ? seconds : total,
    start,
    reset,
    restart,
  }
}
