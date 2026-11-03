import { useSyncExternalStore } from "react"
import type { PainId } from "./tallerNov26Copy"

/**
 * Dolores que el visitante marcó en "¿Qué te pasa hoy?". Lo comparten la
 * sección de dolores y la ruta de módulos (que resalta las paradas que los
 * resuelven). Store mínimo para no meter un provider en la página.
 */
let selected: ReadonlySet<PainId> = new Set()
const listeners = new Set<() => void>()

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function togglePain(id: PainId) {
  const next = new Set(selected)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected = next
  listeners.forEach((l) => l())
}

export function useSelectedPains(): ReadonlySet<PainId> {
  return useSyncExternalStore(subscribe, () => selected, () => selected)
}
