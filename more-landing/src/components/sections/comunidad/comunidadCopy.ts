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

/** Texto único de los CTAs que llevan al formulario (un solo mensaje repetido en toda la página). */
export const COMUNIDAD_CTA_LABEL = "Quiero unirme a la comunidad"

export const COMUNIDAD_PAGE_META = {
  title: "Comunidad MORE — Acceso gratuito | Migración a EE.UU. para profesionales",
  description:
    "Únete gratis a la comunidad de MORE en Facebook: contenido de Ivon More sobre visas y rutas migratorias a Estados Unidos, acceso prioritario a masterclasses y una red de profesionales en el mismo camino.",
  ogTitle: "Comunidad MORE — Acceso gratuito",
  ogDescription:
    "Contenido de Ivon More, acceso prioritario a masterclasses y una red de profesionales que planifican su camino a Estados Unidos.",
} as const

export const COMUNIDAD_REGISTRO_PAGE_META = {
  title: "¡Listo! Entra a la comunidad de MORE en Facebook",
  description:
    "Tu registro está confirmado. Entra al grupo de Facebook de MORE para recibir el contenido y los avisos de las próximas masterclasses.",
  ogTitle: "¡Listo! Entra a la comunidad de MORE en Facebook",
  ogDescription:
    "Tu registro está confirmado. Entra al grupo de Facebook de MORE para recibir el contenido y los avisos de las próximas masterclasses.",
} as const

const SHARED_COPY = {
  formEyebrow: "Comunidad MORE · Acceso gratuito",
  formHeadlineBefore: "Entra a la comunidad de",
  formHeadlineHighlight: "profesionales rumbo a EE.UU.",
  formSubcopy: "Déjanos tus datos en 30 segundos y te abrimos la puerta del grupo.",
  successTitle: "¡Listo, ya casi estás dentro!",
  successLine1: "Último paso 👇",
  successLine2: "Entra al grupo de Facebook y solicita tu acceso.",
  successLine3:
    "Ahí publicamos el contenido de Ivon More, los lives de preguntas y los avisos de las próximas masterclasses del Instituto More.",
  successCta: "Entrar al grupo de Facebook",
} as const

const FORM_COPY: Record<ComunidadFormVariant, ComunidadFormCopy> = {
  default: { ...SHARED_COPY },
  ads: { ...SHARED_COPY },
}

export const getComunidadFormCopy = (
  variant: ComunidadFormVariant = "default"
): ComunidadFormCopy => FORM_COPY[variant]
