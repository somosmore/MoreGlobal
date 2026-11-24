import type { MouseEvent } from "react"

/** Baja al formulario (#registro) y avisa al formulario para enfocar el primer campo. */
export function scrollToRegistro(e?: MouseEvent<HTMLElement>) {
  e?.preventDefault()
  document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "start" })
  window.dispatchEvent(new Event("focus-registro"))
}
