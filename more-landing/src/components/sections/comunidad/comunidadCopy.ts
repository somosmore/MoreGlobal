export type ComunidadFormVariant = "default" | "ads"

export type ComunidadFormCopy = {
  formEyebrow: string
  formHeadlineBefore: string
  formHeadlineHighlight: string
  formSubcopy: string
  successTitle: string
  successLine1: string
  successLine2: string
  successLine3: string
  successCta: string
}

/** Texto único de los CTAs que llevan al formulario. */
export const COMUNIDAD_CTA_LABEL = "Quiero entrar gratis"

export const COMUNIDAD_PAGE_META = {
  title: "Comunidad MORE — Acceso gratuito | Migración a EE.UU. para profesionales",
  description:
    "Únete gratis a la comunidad de MORE: información clara sobre visas y rutas migratorias a Estados Unidos para profesionales.",
  ogTitle: "Comunidad MORE — Acceso gratuito",
  ogDescription:
    "Información clara de Ivon More, masterclasses y una red de profesionales rumbo a Estados Unidos.",
} as const

export const COMUNIDAD_REGISTRO_PAGE_META = {
  title: "¡Listo! Entra a la comunidad de MORE en Facebook",
  description:
    "Tu registro está confirmado. Entra al grupo de Facebook de MORE para recibir contenido y avisos de próximas masterclasses.",
  ogTitle: "¡Listo! Entra a la comunidad de MORE en Facebook",
  ogDescription:
    "Tu registro está confirmado. Entra al grupo de Facebook de MORE.",
} as const

const SHARED_COPY: ComunidadFormCopy = {
  formEyebrow: "Acceso gratuito",
  formHeadlineBefore: "Da tu",
  formHeadlineHighlight: "próximo paso con claridad.",
  formSubcopy: "Déjanos tus datos y recibe acceso al grupo. Te toma menos de un minuto.",
  successTitle: "¡Listo, ya casi estás dentro!",
  successLine1: "Último paso 👇",
  successLine2: "Entra al grupo de Facebook y solicita tu acceso.",
  successLine3:
    "Ahí publicamos contenido de Ivon More, lives de preguntas y avisos de las próximas masterclasses.",
  successCta: "Entrar al grupo de Facebook",
}

const FORM_COPY: Record<ComunidadFormVariant, ComunidadFormCopy> = {
  default: { ...SHARED_COPY },
  ads: { ...SHARED_COPY },
}

export const getComunidadFormCopy = (
  variant: ComunidadFormVariant = "default"
): ComunidadFormCopy => FORM_COPY[variant]
