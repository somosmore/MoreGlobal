export type TallerNiwFormVariant = "default" | "ads"

export type TallerNiwFormCopy = {
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

export const TALLER_NIW_REGISTRO_PAGE_META = {
  title: "Taller gratis: Red flags de abogados — MORE",
  description:
    "Aprende a detectar señales de alerta antes de pagarle a un abogado. En vivo con Ivon More. 13 jul 2026, 7 PM Colombia.",
  ogTitle: "Taller gratis: Red flags de abogados — MORE",
  ogDescription:
    "Aprende a detectar señales de alerta antes de pagarle a un abogado. En vivo con Ivon More. 13 jul 2026, 7 PM Colombia.",
} as const

export const TALLER_NIW_REGISTRO_HEADER =
  "Taller en vivo · Lunes 13 de julio · 7 PM (Colombia)"

const SUCCESS_COPY = {
  successTitle: "¡Listo, tu lugar está reservado!",
  successLine1: "Solo falta un paso 👇",
  successLine2: "Únete a la comunidad de WhatsApp 📲",
  successLine3:
    "Ahí te compartimos el acceso al taller en vivo y los recordatorios para que no te lo pierdas.",
  successCta: "Quiero unirme al grupo de WhatsApp",
} as const

const FORM_COPY: Record<TallerNiwFormVariant, TallerNiwFormCopy> = {
  default: {
    formEyebrow: "Taller gratuito · Lunes 13 de julio 2026",
    formHeadlineBefore: "Antes de pagarle a un",
    formHeadlineHighlight: "abogado",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "El taller sobre red flags de los abogados de inmigración ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
  ads: {
    formEyebrow: "Taller gratuito · Lunes 13 de julio 2026",
    formHeadlineBefore: "Antes de pagarle a un",
    formHeadlineHighlight: "abogado",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "Este taller ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
}

export const getTallerNiwFormCopy = (
  variant: TallerNiwFormVariant = "default"
): TallerNiwFormCopy => FORM_COPY[variant]
