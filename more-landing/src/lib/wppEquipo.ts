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

export type CountryOption = {
  code: string
  name: string
  flag: string
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "593", name: "Ecuador", flag: "🇪🇨" },
  { code: "57", name: "Colombia", flag: "🇨🇴" },
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

export const DEFAULT_COUNTRY_CODE = "593"

export type NormalizedPhone = {
  digits: string
  url: string
  display: string
  valid: boolean
}

const sortedCountryCodes = [...COUNTRY_OPTIONS]
  .map((c) => c.code)
  .sort((a, b) => b.length - a.length)

const startsWithKnownCountryCode = (digits: string): string | null => {
  for (const code of sortedCountryCodes) {
    if (digits.startsWith(code) && digits.length >= code.length + 7) return code
  }
  return null
}

export const normalizePhone = (
  rawPhone: string,
  defaultCountryCode: string,
): NormalizedPhone => {
  const digits = rawPhone.replace(/\D/g, "")
  if (!digits) return { digits: "", url: "", display: "", valid: false }

  if (digits.startsWith(defaultCountryCode) && digits.length >= defaultCountryCode.length + 7) {
    const full = digits
    return {
      digits: full,
      url: `https://wa.me/${full}`,
      display: `+${full}`,
      valid: full.length >= 10 && full.length <= 15,
    }
  }

  const matchedCode = startsWithKnownCountryCode(digits)
  if (matchedCode && !digits.startsWith("0")) {
    const full = digits
    return {
      digits: full,
      url: `https://wa.me/${full}`,
      display: `+${full}`,
      valid: full.length >= 10 && full.length <= 15,
    }
  }

  const national = digits.replace(/^0+/, "")
  if (!national) return { digits: "", url: "", display: "", valid: false }

  const full = defaultCountryCode + national
  return {
    digits: full,
    url: `https://wa.me/${full}`,
    display: `+${full}`,
    valid: full.length >= 10 && full.length <= 15,
  }
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
