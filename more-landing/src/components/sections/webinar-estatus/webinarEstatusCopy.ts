export type WebinarEstatusFormVariant = "default" | "ads"

export type WebinarEstatusFormCopy = {
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

export const WEBINAR_ESTATUS_REGISTRO_PAGE_META = {
  title: "¡Listo! Únete al grupo del webinar — MORE",
  description:
    "Tu lugar está reservado. Únete al grupo de WhatsApp para recibir el acceso al webinar en vivo y los recordatorios.",
  ogTitle: "¡Listo! Únete al grupo del webinar — MORE",
  ogDescription:
    "Tu lugar está reservado. Únete al grupo de WhatsApp para recibir el acceso al webinar en vivo y los recordatorios.",
} as const

export const WEBINAR_ESTATUS_REGISTRO_HEADER =
  "Webinar en vivo · ¿Cuál es tu estatus, de verdad?"

const SUCCESS_COPY = {
  successTitle: "¡Listo, tu lugar está reservado!",
  successLine1: "Solo falta un paso 👇",
  successLine2: "Únete a la comunidad de WhatsApp 📲",
  successLine3:
    "Ahí te compartimos el acceso al webinar en vivo y los recordatorios para que no te lo pierdas.",
  successCta: "Quiero unirme al grupo de WhatsApp",
} as const

const FORM_COPY: Record<WebinarEstatusFormVariant, WebinarEstatusFormCopy> = {
  default: {
    formEyebrow: "Webinar gratuito en vivo",
    formHeadlineBefore: "Quiero entender",
    formHeadlineHighlight: "mi estatus migratorio",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "Este webinar ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
  ads: {
    formEyebrow: "Webinar gratuito en vivo",
    formHeadlineBefore: "Quiero entender",
    formHeadlineHighlight: "mi estatus migratorio",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    expiredBody:
      "Este webinar ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
    ...SUCCESS_COPY,
  },
}

export const getWebinarEstatusFormCopy = (
  variant: WebinarEstatusFormVariant = "default"
): WebinarEstatusFormCopy => FORM_COPY[variant]
