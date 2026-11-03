import type { SiteSettingsMap } from "@/lib/supabase"

/** Identificadores del evento en Supabase (`masterclass_leads.source`) y GHL. */
export const TALLER_SOURCE = "taller-comunidad-nov-26"
export const TALLER_EVENT_LABEL = "Taller Comunidad More — Diseña tu ruta (23 nov 2026)"
export const TALLER_GHL_TAG = "Taller-Comunidad-Nov-26"

/** Texto único de los CTAs que llevan a las entradas / formulario. */
export const TALLER_CTA_LABEL = "Elegir mi entrada"

export const TALLER_DATE_LABEL = "Lunes 23 de noviembre"
export const TALLER_TIME_LABEL = "7:00 PM (hora Colombia)"

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

/** Los 5 dolores, cada uno conectado al módulo que lo resuelve. */
export const PAINS = [
  {
    id: "empezar",
    quote: "No sé por dónde empezar.",
    text: "Demasiada información, consejos contradictorios y rumores de redes.",
    moduleId: 1,
  },
  {
    id: "visa",
    quote: "Tengo todo, menos la visa.",
    text: "Ofertas que piden residencia, rechazos por necesitar sponsor, depender de un empleador.",
    moduleId: 2,
  },
  {
    id: "tope",
    quote: "Llegué a un tope.",
    text: "Techo profesional en tu país y miedo a empezar de cero en EE.UU.",
    moduleId: 2,
  },
  {
    id: "experiencia",
    quote: "Mi experiencia es real, pero no tengo cómo probarla.",
    text: "Empresas que cerraron, jefes que no están, certificados sin funciones.",
    moduleId: 3,
  },
  {
    id: "costo",
    quote: "¿Cuánto me va a costar realmente?",
    text: "Tasas, traducciones, equivalencias y el miedo a endeudarte.",
    moduleId: 4,
  },
] as const

export type PainId = (typeof PAINS)[number]["id"]

export type TicketType = "general" | "vip"

type TicketDef = {
  id: TicketType
  name: string
  tagline: string
  includes: string[]
  priceKey: keyof SiteSettingsMap
  linkKey: keyof SiteSettingsMap
  highlighted?: boolean
}

// TODO(confirmar con el equipo): beneficios exactos de cada entrada.
export const TICKETS: TicketDef[] = [
  {
    id: "general",
    name: "General",
    tagline: "Todo lo que necesitas para salir con tu ruta.",
    includes: [
      "Acceso completo al taller en vivo",
      "Material de trabajo digital",
      "Ronda de preguntas al cierre",
    ],
    priceKey: "tc_general_price",
    linkKey: "tc_general_payment_link",
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "Más completo, con espacio para tu caso.",
    includes: [
      "Todo lo de la entrada General",
      "Grabación del taller",
      "Espacio prioritario para tus preguntas",
    ],
    priceKey: "tc_vip_price",
    linkKey: "tc_vip_payment_link",
    highlighted: true,
  },
]

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
  title: "Taller Comunidad More — Diseña tu ruta migratoria a EE.UU. | 23 de noviembre",
  description:
    "Taller virtual en vivo con Ivon More. Lunes 23 de noviembre, 7:00 PM Colombia. Descubre qué ruta migratoria te conviene, cómo demostrar tu experiencia y cuánto cuesta realmente, sin invertir de más.",
  ogTitle: "Taller Comunidad More — Diseña tu ruta migratoria a EE.UU.",
  ogDescription:
    "En vivo y virtual, 23 de noviembre a las 7:00 PM (Colombia). Sales con una ruta, no con dudas.",
} as const

export const TALLER_REGISTRO_PAGE_META = {
  title: "Completa tu entrada — Taller Comunidad More",
  description: "Elige tu entrada y completa el pago para asegurar tu lugar en el taller del 23 de noviembre.",
  ogTitle: "Completa tu entrada — Taller Comunidad More",
  ogDescription: "Elige tu entrada y completa el pago para asegurar tu lugar en el taller del 23 de noviembre.",
} as const
