/**
 * Enlaces de WhatsApp de la empresa.
 *
 * El número vive en `whatsapp_number` (site_settings) y se edita desde
 * Admin → Settings → Contacto. En los archivos de traducción solo guardamos el
 * MENSAJE que se pre-carga en el chat, nunca la URL: así el número no queda
 * repetido (ni desactualizado) en media docena de JSON.
 *
 * Ojo: esto es para el chat 1-a-1 con MORE. Las invitaciones a grupos
 * (chat.whatsapp.com) y el teléfono de cada lead son otra cosa y no pasan por acá.
 */

/** Último recurso si todavía no cargaron los settings. */
export const WHATSAPP_FALLBACK = "+573022419122"

/** Deja solo los dígitos: wa.me no acepta "+", espacios ni guiones. */
export function toWhatsappDigits(phone?: string | null): string {
  const digits = (phone || "").replace(/\D/g, "")
  return digits || WHATSAPP_FALLBACK.replace(/\D/g, "")
}

/** Arma el enlace al chat, con el mensaje ya codificado. */
export function buildWhatsappUrl(phone?: string | null, message?: string): string {
  const base = `https://wa.me/${toWhatsappDigits(phone)}`
  const trimmed = message?.trim()
  return trimmed ? `${base}?text=${encodeURIComponent(trimmed)}` : base
}

/** "+573022419122" → "+57 302 241 9122" (móviles de Colombia); otros quedan como vienen. */
export function formatPhoneDisplay(phone?: string | null): string {
  const digits = toWhatsappDigits(phone)
  const co = digits.match(/^57(3\d{2})(\d{3})(\d{4})$/)
  return co ? `+57 ${co[1]} ${co[2]} ${co[3]}` : `+${digits}`
}

/** El número tal como se muestra en pantalla (p. ej. en los PDF). */
export function formatWhatsappDisplay(phone?: string | null): string {
  return `wa.me/${toWhatsappDigits(phone)}`
}
