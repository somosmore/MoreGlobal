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
  title: "¡Listo! Únete al grupo del taller — MORE",
  description:
    "Tu lugar está reservado. Únete al grupo de WhatsApp para recibir el acceso al taller en vivo y los recordatorios.",
  ogTitle: "¡Listo! Únete al grupo del taller — MORE",
  ogDescription:
    "Tu lugar está reservado. Únete al grupo de WhatsApp para recibir el acceso al taller en vivo y los recordatorios.",
} as const

export const TALLER_NIW_REGISTRO_HEADER =
  "Taller en vivo · Estrategias para cambio de estatus"

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
    formEyebrow: "Taller gratuito en vivo",
    formHeadlineBefore: "Quiero prepararme para mi",
    formHeadlineHighlight: "cambio de estatus",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "Este taller ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
  ads: {
    formEyebrow: "Taller gratuito en vivo",
    formHeadlineBefore: "Quiero prepararme para mi",
    formHeadlineHighlight: "cambio de estatus",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "Este taller ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
}

export const getTallerNiwFormCopy = (
  variant: TallerNiwFormVariant = "default"
): TallerNiwFormCopy => FORM_COPY[variant]
