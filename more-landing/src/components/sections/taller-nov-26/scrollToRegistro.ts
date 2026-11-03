import type { MouseEvent } from "react"
import type { TicketType } from "./tallerNov26Copy"

/**
 * Lleva al usuario al formulario de registro con scroll suave y pide foco en el
 * primer campo. Si se indica una entrada, el formulario la preselecciona
 * (escucha `select-ticket` y `focus-registro`).
 */
export const scrollToRegistro = (e?: MouseEvent<HTMLElement>, ticket?: TicketType) => {
  e?.preventDefault()
  if (ticket) {
    window.dispatchEvent(new CustomEvent<TicketType>("select-ticket", { detail: ticket }))
  }
  const el = document.getElementById("registro")
  el?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", "#registro")
  window.dispatchEvent(new CustomEvent("focus-registro"))
}

/** Lleva a la sección de entradas (General / VIP) para que el usuario elija. */
export const scrollToEntradas = (e?: MouseEvent<HTMLElement>) => {
  e?.preventDefault()
  document.getElementById("entradas")?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", "#entradas")
}
