import type { MouseEvent } from "react"

/**
 * Lleva al usuario al formulario de registro con scroll suave y pide foco en el
 * primer campo. El formulario escucha el evento `focus-registro`.
 */
export const scrollToRegistro = (e?: MouseEvent<HTMLElement>) => {
  e?.preventDefault()
  const el = document.getElementById("registro")
  el?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", "#registro")
  window.dispatchEvent(new CustomEvent("focus-registro"))
}
