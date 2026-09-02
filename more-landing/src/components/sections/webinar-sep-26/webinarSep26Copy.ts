export type WebinarSep26FormVariant = "default" | "ads"

export type WebinarSep26FormCopy = {
  formEyebrow: string
  formHeadlineBefore: string
  formHeadlineHighlight: string
  formSubcopy: string
  expiredBody: string
  successTitle: string
  successLine1: string
  successLine2: string
  successLine3: string
  successCta: string
}

export const WEBINAR_SEP26_REGISTRO_PAGE_META = {
  title: "¡Listo! Únete al grupo de la Masterclass 1 — Instituto More",
  description:
    "Tu lugar en la Masterclass 1 está reservado. Únete al grupo de WhatsApp para recibir el acceso en vivo y los recordatorios.",
  ogTitle: "¡Listo! Únete al grupo de la Masterclass 1 — Instituto More",
  ogDescription:
    "Tu lugar en la Masterclass 1 está reservado. Únete al grupo de WhatsApp para recibir el acceso en vivo y los recordatorios.",
} as const

export const WEBINAR_SEP26_REGISTRO_HEADER =
  "Masterclass 1 en vivo · El nuevo panorama migratorio de Estados Unidos"

const SUCCESS_COPY = {
  successTitle: "¡Listo, tu lugar en la Masterclass 1 está reservado!",
  successLine1: "Solo falta un paso 👇",
  successLine2: "Únete a la comunidad de WhatsApp 📲",
  successLine3:
    "Ahí te compartimos el acceso a la clase en vivo, los recordatorios y el calendario de las siguientes masterclasses del Instituto More.",
  successCta: "Quiero unirme al grupo de WhatsApp",
} as const

const SHARED_COPY = {
  formEyebrow: "Masterclass 1 · Instituto More",
  formHeadlineBefore: "Quiero entender",
  formHeadlineHighlight: "el nuevo panorama migratorio",
  formSubcopy: "Regístrate en 30 segundos y asegura tu lugar del 3 de septiembre.",
  expiredBody:
    "Esta masterclass ya fue realizada. Síguenos para enterarte de la próxima clase del Instituto More.",
  ...SUCCESS_COPY,
} as const

const FORM_COPY: Record<WebinarSep26FormVariant, WebinarSep26FormCopy> = {
  default: { ...SHARED_COPY },
  ads: { ...SHARED_COPY },
}

export const getWebinarSep26FormCopy = (
  variant: WebinarSep26FormVariant = "default"
): WebinarSep26FormCopy => FORM_COPY[variant]
