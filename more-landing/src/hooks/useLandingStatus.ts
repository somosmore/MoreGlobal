import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type LandingStatusValue =
  | "loading"
  | "active"
  | "inactive"
  | "scheduled"
  | "expired"
  | "error"

export type LandingStatusResult = {
  /** Estado calculado combinando is_active + fechas programadas */
  status: LandingStatusValue
  /** true solo cuando status === "active" */
  isAccessible: boolean
  /** Mensaje corto para mostrar en el fallback de la landing */
  reason: string
}

const STATUS_REASONS: Record<LandingStatusValue, string> = {
  loading: "Cargando...",
  active: "Disponible",
  inactive: "Este evento no está activo en este momento.",
  scheduled:
    "Este evento aún no ha comenzado. Vuelve más tarde.",
  expired: "Este evento ha finalizado.",
  error: "No se pudo verificar el estado del evento.",
}

/**
 * Verifica en runtime si una landing pública debe estar accesible.
 *
 * Orden de evaluación:
 *  1. deactivate_at definido y ya pasó → expired
 *  2. activate_at definido y aún no llega → scheduled
 *  3. is_active === false → inactive
 *  4. Pasa todo lo anterior → active
 *
 * Nota: la comparación de fechas se hace en el cliente con Date.now() (UTC).
 * Esto es suficiente como "lazy check" sin cron externo.
 */
export function useLandingStatus(route: string): LandingStatusResult {
  // Si no hay cliente Supabase (entorno dev/local sin env vars), se asume activa directamente
  const [status, setStatus] = useState<LandingStatusValue>(
    () => (!supabase ? "active" : "loading")
  )

  useEffect(() => {
    if (!supabase) return

    let cancelled = false

    supabase
      .from("landing_projects")
      .select("is_active, activate_at, deactivate_at")
      .eq("route", route)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return

        if (error || !data) {
          setStatus("error")
          return
        }

        const now = Date.now()

        if (data.deactivate_at && now >= new Date(data.deactivate_at).getTime()) {
          setStatus("expired")
          return
        }

        if (data.activate_at && now < new Date(data.activate_at).getTime()) {
          setStatus("scheduled")
          return
        }

        if (!data.is_active) {
          setStatus("inactive")
          return
        }

        setStatus("active")
      })

    return () => {
      cancelled = true
    }
  }, [route])

  return {
    status,
    isAccessible: status === "active",
    reason: STATUS_REASONS[status],
  }
}
