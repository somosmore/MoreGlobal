import type { MouseEvent } from "react"

/**
 * Lleva al usuario al formulario de registro con scroll suave y pide foco en el
 * primer campo. El formulario (TNRegistrationForm) escucha el evento
 * `focus-registro` para enfocar el input de nombre una vez completado el scroll.
 *
 * Mantiene `href="#registro"` en los enlaces como fallback sin JS.
 */
export function scrollToRegistro(e?: MouseEvent<HTMLAnchorElement>) {
  e?.preventDefault()
  const el = document.getElementById("registro")
  el?.scrollIntoView({ behavior: "smooth" })
  window.history.replaceState(null, "", "#registro")
  window.dispatchEvent(new CustomEvent("focus-registro"))
}
