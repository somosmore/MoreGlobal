export const WPPEQUIPO_PUBLIC_URL = "https://moremigracion.com/wppequipo"

export const WHATSAPP_URL_PATTERN =
  /^https?:\/\/(wa\.me|wa\.link|api\.whatsapp\.com|chat\.whatsapp\.com)\/.+/i

export const isValidWhatsappUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return false
  return WHATSAPP_URL_PATTERN.test(trimmed)
}

export const buildWhatsappUrlFromPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return null
  return `https://wa.me/${digits}`
}

export const pickRandomUrl = (urls: string[]) => {
  if (urls.length === 0) return null
  return urls[Math.floor(Math.random() * urls.length)]
}
