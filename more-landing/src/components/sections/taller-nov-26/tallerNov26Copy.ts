import type { SiteSettingsMap } from "@/lib/supabase"

/** Identificadores del evento en Supabase (`masterclass_leads.source`) y GHL. */
export const TALLER_SOURCE = "taller-comunidad-nov-26"
export const TALLER_EVENT_LABEL = "Taller Comunidad More — 23 y 24 nov 2026"
export const TALLER_GHL_TAG = "Taller-Comunidad-Nov-26"

/** Texto único de los CTAs que llevan a las entradas / formulario. */
export const TALLER_CTA_LABEL = "Elegir mi entrada"

export const TALLER_DATE_LABEL = "Lunes 23 y martes 24 de noviembre"
export const TALLER_TIME_LABEL = "7:00 PM (hora Colombia)"

/** Los dos días del taller. El contador del hero cuenta hasta el día 1. */
export const TALLER_DAYS = [
  { id: 1, date: "Lunes 23 de noviembre", short: "Lun 23 Nov", title: "Diseña tu ruta", forWho: "Para quien empieza de cero" },
  { id: 2, date: "Martes 24 de noviembre", short: "Mar 24 Nov", title: "Destraba tu proceso", forWho: "Para quien ya inició o lo hace solo" },
] as const

/** Módulos del taller: son las "paradas" de la ruta. */
export const MODULES = [
  {
    id: 1,
    title: "Dónde estás hoy",
    text: "Tu punto de partida real: perfil, estatus y opciones. Para dejar de adivinar por dónde empezar.",
  },
  {
    id: 2,
    title: "Qué ruta te conviene",
    text: "Los caminos más comunes —para profesionales, empresarios y quienes ya están en EE.UU.— y cuál encaja contigo.",
  },
  {
    id: 3,
    title: "Cómo demostrar tu experiencia",
    text: "Qué hacer cuando la empresa ya cerró, el jefe no está o el certificado no dice tus funciones. El obstáculo número uno, resuelto con método.",
  },
  {
    id: 4,
    title: "El costo real, sin sorpresas",
    text: "Dónde se va el dinero: tasas, traducciones, equivalencias. Y cómo evitar los errores que más cuestan.",
  },
  {
    id: 5,
    title: "Tu plan de acción",
    text: "Pasos concretos para empezar la próxima semana, con estrategia y en el orden correcto.",
  },
] as const

/** Día 2 — "Destraba tu proceso": para quien ya inició o lo hace solo. */
export const MODULES_DAY2 = [
  {
    id: 1,
    title: "Dónde se traba tu caso",
    text: "Un diagnóstico que aplicas en vivo a tu proceso para encontrar los bloqueos reales, no los que imaginas.",
  },
  {
    id: 2,
    title: "Probar experiencia sin empresa, sin jefe, sin certificado",
    text: "El bloqueo número uno durante el proceso: qué evidencia sí sirve cuando la empresa cerró o nadie firma.",
  },
  {
    id: 3,
    title: "Cartas que nadie quiere firmar",
    text: "Alternativas y cómo pedirlas para que sí lleguen, sin depender de una sola persona.",
  },
  {
    id: 4,
    title: "RFE y negaciones: qué piden de verdad",
    text: "Cómo leer una solicitud de más evidencia y qué significa una negación para tu caso, sin promesas.",
  },
  {
    id: 5,
    title: "Casos en vivo y qué cambió este mes",
    text: "Ivon ordena casos reales de asistentes en pantalla y repasa los cambios que afectan a los procesos en curso.",
  },
] as const

/** Los dolores, cada uno conectado al día y la parada que lo resuelve. */
export const PAINS = [
  {
    id: "empezar",
    quote: "No sé por dónde empezar.",
    text: "Demasiada información, consejos contradictorios y rumores de redes.",
    day: 1,
    moduleId: 1,
  },
  {
    id: "visa",
    quote: "Tengo todo, menos la visa.",
    text: "Ofertas que piden residencia, rechazos por necesitar patrocinador, depender de un empleador.",
    day: 1,
    moduleId: 2,
  },
  {
    id: "tope",
    quote: "Llegué a un tope.",
    text: "Techo profesional en tu país y miedo a empezar de cero en EE.UU.",
    day: 1,
    moduleId: 2,
  },
  {
    id: "experiencia",
    quote: "Mi experiencia es real, pero no tengo cómo probarla.",
    text: "Empresas que cerraron, jefes que no están, certificados sin funciones.",
    day: 2,
    moduleId: 2,
  },
  {
    id: "costo",
    quote: "¿Cuánto me va a costar realmente?",
    text: "Tasas, traducciones, equivalencias y el miedo a endeudarte.",
    day: 1,
    moduleId: 4,
  },
  {
    id: "hijos",
    quote: "¿Mi hijo pierde la opción de venir conmigo a los 21?",
    text: "Los hijos entran como dependientes solo hasta los 21. Y el reloj ya está corriendo.",
    day: 1,
    moduleId: 2,
  },
  {
    id: "quemado",
    quote: "Ya consulté varios abogados y sigo sin claridad.",
    text: "Una negación, un RFE (solicitud de más evidencia) o meses haciéndolo solo. No es falta de capacidad: es falta de estrategia.",
    day: 2,
    moduleId: 1,
  },
] as const

export type PainId = (typeof PAINS)[number]["id"]

/** Una sola entrada cubre los dos días: `general` (General) o `vip` (VIP). */
export type TicketType = "general" | "vip"

type TicketDef = {
  id: TicketType
  name: string
  /** Fecha que se muestra en el pase de abordar. */
  dateLabel: string
  tagline: string
  includes: string[]
  priceKey: keyof SiteSettingsMap
  linkKey: keyof SiteSettingsMap
  /** Precio y link de la versión Comunidad More (/taller-23nov/comunidad). */
  comunidadPriceKey: keyof SiteSettingsMap
  comunidadLinkKey: keyof SiteSettingsMap
  highlighted?: boolean
}

/** Versión de la landing: pública o con precio exclusivo de la Comunidad More. */
export type PriceTier = "publico" | "comunidad"

/** Tag extra en GHL para medir los registros con precio de comunidad. */
export const COMUNIDAD_PRICE_TAG = "Taller-Comunidad-Nov-26-Precio-Comunidad"

export type TicketPricing = {
  /** Precio vigente para esta versión (texto visible, vacío si no está cargado). */
  price: string
  /** Precio público tachado (solo en la versión comunidad). */
  compareAt: string | null
  /** Link de pago vigente para esta versión. */
  link: string
}

export function getTicketPricing(
  ticket: Pick<TicketDef, "priceKey" | "linkKey" | "comunidadPriceKey" | "comunidadLinkKey">,
  settings: SiteSettingsMap,
  tier: PriceTier,
): TicketPricing {
  const publicPrice = settings[ticket.priceKey].trim()
  if (tier === "comunidad") {
    const price = settings[ticket.comunidadPriceKey].trim()
    return {
      price,
      compareAt: publicPrice && publicPrice !== price ? publicPrice : null,
      link: settings[ticket.comunidadLinkKey],
    }
  }
  return { price: publicPrice, compareAt: null, link: settings[ticket.linkKey] }
}

// Entradas acordadas con el usuario (2026-11-05): un solo pago cubre los dos días.
export const TICKETS: TicketDef[] = [
  {
    id: "general",
    name: "General",
    dateLabel: "23–24 NOV",
    tagline: "Los dos días en vivo: diseña tu ruta y destraba tu proceso.",
    includes: [
      "Día 1 (lunes 23) y Día 2 (martes 24) en vivo",
      "Material de trabajo digital",
      "Ronda de preguntas al cierre de cada día",
    ],
    priceKey: "tc_general_price",
    linkKey: "tc_general_payment_link",
    comunidadPriceKey: "tc_comunidad_general_price",
    comunidadLinkKey: "tc_comunidad_general_payment_link",
  },
  {
    id: "vip",
    name: "VIP",
    dateLabel: "23–24 NOV",
    tagline: "Los dos días y revisión de tu caso.",
    includes: [
      "Todo lo de la entrada General",
      "Revisión de tu perfil o expediente por el equipo de MORE",
      "Grabación de los dos días en 24 horas",
      "Prioridad para tus preguntas en vivo",
    ],
    priceKey: "tc_vip_price",
    linkKey: "tc_vip_payment_link",
    comunidadPriceKey: "tc_comunidad_vip_price",
    comunidadLinkKey: "tc_comunidad_vip_payment_link",
    highlighted: true,
  },
]

/** Compromisos operativos explícitos (responden a las críticas de clientes en el análisis 2023–2026). */
export const GUARANTEES = [
  { title: "Fechas fijas", text: "Lunes 23 y martes 24 de noviembre, 7:00 PM (Colombia). No se posponen." },
  { title: "Grabación en 24 horas", text: "Con la entrada VIP la recibes al día siguiente, sin excusas." },
  { title: "Un solo canal", text: "Acceso, material y avisos por correo y WhatsApp. Nada perdido en Drive." },
  { title: "Todo por escrito", text: "Qué incluye cada entrada, antes de pagar. Sin letra pequeña." },
] as const

/** Los 3 miedos que más frenan la decisión (análisis de clientes 2023–2026). */
export const FEARS = [
  {
    q: "“¿Una negación me cierra todas las puertas?”",
    a: "Te explicamos qué afecta realmente una negación previa y qué no, para que decidas con información y no con miedo.",
  },
  {
    q: "“Cambian las reglas cada semana.”",
    a: "Separamos lo que cambió de verdad de lo que es rumor de redes, con fuentes oficiales.",
  },
  {
    q: "“¿Mi perfil alcanza?”",
    a: "Derribamos los mitos de quién califica: edad, maestría, áreas mezcladas. Muchos perfiles que creen que no califican, sí tienen ruta.",
  },
] as const

export const getTicket = (id: TicketType): TicketDef =>
  TICKETS.find((t) => t.id === id) ?? TICKETS[0]

/**
 * Link de pago listo para usar. En Stripe Payment Links se precarga el email
 * y se adjunta una referencia para conciliar el pago con el lead.
 */
export function buildPaymentUrl(rawLink: string, email?: string): string | null {
  const link = rawLink.trim()
  if (!/^https?:\/\//i.test(link)) return null
  try {
    const url = new URL(link)
    if (url.hostname === "buy.stripe.com" && email) {
      url.searchParams.set("prefilled_email", email)
      url.searchParams.set("client_reference_id", TALLER_SOURCE)
    }
    return url.toString()
  } catch {
    return null
  }
}

export const TALLER_PAGE_META = {
  title: "Taller Comunidad More — Diseña tu ruta y destraba tu proceso | 23 y 24 de noviembre",
  description:
    "Taller virtual en vivo con Ivon More. Lunes 23 (diseña tu ruta) y martes 24 de noviembre (destraba tu proceso), 7:00 PM Colombia. Para quien empieza de cero y para quien ya inició.",
  ogTitle: "Taller Comunidad More — Diseña tu ruta migratoria a EE.UU.",
  ogDescription:
    "En vivo y virtual, 23 y 24 de noviembre a las 7:00 PM (Colombia). Sales con una ruta, no con dudas.",
} as const

export const TALLER_REGISTRO_PAGE_META = {
  title: "Completa tu entrada — Taller Comunidad More",
  description: "Elige tu entrada y completa el pago para asegurar tu lugar en el taller del 23 y 24 de noviembre.",
  ogTitle: "Completa tu entrada — Taller Comunidad More",
  ogDescription: "Elige tu entrada y completa el pago para asegurar tu lugar en el taller del 23 y 24 de noviembre.",
} as const
