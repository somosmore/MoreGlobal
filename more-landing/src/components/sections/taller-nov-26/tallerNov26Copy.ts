import type { SiteSettingsMap } from "@/lib/supabase"

/** Identificadores del evento en Supabase (`masterclass_leads.source`) y GHL. */
export const TALLER_SOURCE = "taller-comunidad-nov-26"
export const TALLER_EVENT_LABEL = "Taller Comunidad More — Diseña tu ruta (23 nov 2026)"
export const TALLER_GHL_TAG = "Taller-Comunidad-Nov-26"

/** Texto único de los CTAs que llevan a las entradas / formulario. */
export const TALLER_CTA_LABEL = "Elegir mi entrada"

export const TALLER_DATE_LABEL = "Lunes 23 de noviembre"
export const TALLER_TIME_LABEL = "7:00 PM (hora Colombia)"

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
