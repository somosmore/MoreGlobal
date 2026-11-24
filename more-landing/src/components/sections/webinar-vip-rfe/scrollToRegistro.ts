import type { MouseEvent } from "react"
import type { WvTicketId } from "./webinarVipRfeCopy"

/** Baja al formulario (#registro), preselecciona la entrada elegida y enfoca el primer campo. */
export function scrollToRegistro(e?: MouseEvent<HTMLElement>, ticket?: WvTicketId) {
  e?.preventDefault()
  if (ticket) window.dispatchEvent(new CustomEvent<WvTicketId>("select-ticket", { detail: ticket }))
  document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "start" })
  window.dispatchEvent(new Event("focus-registro"))
}
