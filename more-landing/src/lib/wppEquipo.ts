import { buildWhatsappUrl } from "./whatsapp"

export const WPPEQUIPO_PUBLIC_URL = "https://moremigracion.com/wppequipo"

export const WHATSAPP_URL_PATTERN =
  /^https?:\/\/(wa\.me|wa\.link|api\.whatsapp\.com|chat\.whatsapp\.com)\/.+/i

export const isValidWhatsappUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return false
  return WHATSAPP_URL_PATTERN.test(trimmed)
}

/** Quita "+" de wa.me / api.whatsapp.com (WhatsApp solo acepta dígitos). */
export const sanitizeWhatsappUrl = (url: string) => {
  const trimmed = url.trim()
  if (!trimmed) return trimmed
  return trimmed
    .replace(/^(https?:\/\/wa\.me\/)\+/i, "$1")
    .replace(/^(https?:\/\/api\.whatsapp\.com\/send\?phone=)\+/i, "$1")
}

export const buildWhatsappUrlFromPhone = (phone: string) => {
  if (!phone.replace(/\D/g, "")) return null
  return buildWhatsappUrl(phone)
}

export const pickRandomUrl = (urls: string[]) => {
  if (urls.length === 0) return null
  const picked = urls[Math.floor(Math.random() * urls.length)]
  return sanitizeWhatsappUrl(picked)
}

export type CountryOption = {
  code: string
  name: string
  flag: string
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "57", name: "Colombia", flag: "🇨🇴" },
  { code: "593", name: "Ecuador", flag: "🇪🇨" },
  { code: "52", name: "México", flag: "🇲🇽" },
  { code: "54", name: "Argentina", flag: "🇦🇷" },
  { code: "51", name: "Perú", flag: "🇵🇪" },
  { code: "56", name: "Chile", flag: "🇨🇱" },
  { code: "591", name: "Bolivia", flag: "🇧🇴" },
  { code: "595", name: "Paraguay", flag: "🇵🇾" },
  { code: "598", name: "Uruguay", flag: "🇺🇾" },
  { code: "504", name: "Honduras", flag: "🇭🇳" },
  { code: "502", name: "Guatemala", flag: "🇬🇹" },
  { code: "503", name: "El Salvador", flag: "🇸🇻" },
  { code: "505", name: "Nicaragua", flag: "🇳🇮" },
  { code: "506", name: "Costa Rica", flag: "🇨🇷" },
  { code: "507", name: "Panamá", flag: "🇵🇦" },
  { code: "509", name: "Haití", flag: "🇭🇹" },
  { code: "58", name: "Venezuela", flag: "🇻🇪" },
  { code: "55", name: "Brasil", flag: "🇧🇷" },
  { code: "34", name: "España", flag: "🇪🇸" },
  { code: "1", name: "USA / Canadá", flag: "🇺🇸" },
]

/** Colombia: mercado principal de MORE. Antes era 593 (Ecuador) y rompía imports. */
export const DEFAULT_COUNTRY_CODE = "57"

export type NormalizedPhone = {
  digits: string
  url: string
  display: string
  valid: boolean
}

/** Longitud del tramo nacional (sin código de país) para no confundir móviles locales. */
const COUNTRY_NATIONAL_LENGTH: Record<string, { min: number; max: number }> = {
  "1": { min: 10, max: 10 },
  "34": { min: 9, max: 9 },
  "51": { min: 8, max: 9 },
  "52": { min: 10, max: 11 },
  "54": { min: 10, max: 11 },
  "55": { min: 10, max: 11 },
  "56": { min: 8, max: 9 },
  "57": { min: 10, max: 10 },
  "58": { min: 10, max: 10 },
  "502": { min: 8, max: 8 },
  "503": { min: 8, max: 8 },
  "504": { min: 8, max: 8 },
  "505": { min: 8, max: 8 },
  "506": { min: 8, max: 8 },
  "507": { min: 7, max: 8 },
  "509": { min: 8, max: 8 },
  "591": { min: 8, max: 8 },
  "593": { min: 8, max: 9 },
  "595": { min: 8, max: 9 },
  "598": { min: 8, max: 8 },
}

const sortedCountryCodes = [...COUNTRY_OPTIONS]
  .map((c) => c.code)
  .sort((a, b) => b.length - a.length)

const matchesKnownCountryCode = (digits: string): string | null => {
  for (const code of sortedCountryCodes) {
    if (!digits.startsWith(code)) continue
    const national = digits.slice(code.length)
    const bounds = COUNTRY_NATIONAL_LENGTH[code]
    if (!bounds) {
      if (national.length >= 7 && digits.length <= 15) return code
      continue
    }
    if (national.length >= bounds.min && national.length <= bounds.max) return code
  }
  return null
}

const toResult = (full: string): NormalizedPhone => ({
  digits: full,
  url: `https://wa.me/${full}`,
  display: `+${full}`,
  valid: full.length >= 10 && full.length <= 15,
})

export const normalizePhone = (
  rawPhone: string,
  defaultCountryCode: string,
): NormalizedPhone => {
  const trimmed = rawPhone.trim()
  if (!trimmed) return { digits: "", url: "", display: "", valid: false }

  const explicitInternational =
    trimmed.startsWith("+") || trimmed.startsWith("00")

  let digits = trimmed.replace(/\D/g, "")
  if (!digits) return { digits: "", url: "", display: "", valid: false }

  // 00XX… → tratar como internacional (mismo criterio que +)
  if (trimmed.startsWith("00") && digits.startsWith("00")) {
    digits = digits.slice(2)
  }

  if (explicitInternational) {
    return toResult(digits)
  }

  // Internacional sin "+" solo si el tramo nacional tiene el largo correcto
  // (evita que un móvil local como 5512… se lea como Brasil, o 313… como otro país).
  const matchedCode = matchesKnownCountryCode(digits)
  if (matchedCode && !digits.startsWith("0")) {
    return toResult(digits)
  }

  const national = digits.replace(/^0+/, "")
  if (!national) return { digits: "", url: "", display: "", valid: false }

  return toResult(defaultCountryCode + national)
}

export type ParsedBulkEntry = {
  id: string
  label: string
  rawPhone: string
  digits: string
  url: string
  display: string
  valid: boolean
  error?: string
}

const isLikelyIndex = (line: string) => {
  const trimmed = line.trim()
  if (!/^\d+$/.test(trimmed)) return false
  return trimmed.length <= 3
}

const isLikelyName = (line: string) => {
  const letters = (line.match(/[\p{L}]/gu) || []).length
  const digits = (line.match(/\d/g) || []).length
  return letters >= 2 && letters > digits
}

const isLikelyPhone = (line: string) => {
  const digits = (line.match(/\d/g) || []).length
  return digits >= 7
}

const makeEntryId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const parseBulkPhoneList = (
  text: string,
  defaultCountryCode: string,
): ParsedBulkEntry[] => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const entries: ParsedBulkEntry[] = []
  let pendingLabel = ""

  for (const line of lines) {
    if (isLikelyIndex(line)) continue

    if (isLikelyName(line) && !isLikelyPhone(line)) {
      pendingLabel = line
      continue
    }

    if (isLikelyPhone(line)) {
      const normalized = normalizePhone(line, defaultCountryCode)
      const label = pendingLabel || "Sin nombre"
      entries.push({
        id: makeEntryId(),
        label,
        rawPhone: line,
        digits: normalized.digits,
        url: normalized.url,
        display: normalized.display,
        valid: normalized.valid && pendingLabel.length > 0,
        error: !pendingLabel
          ? "Falta nombre antes del número"
          : !normalized.valid
            ? "Número inválido"
            : undefined,
      })
      pendingLabel = ""
    }
  }

  return entries
}
