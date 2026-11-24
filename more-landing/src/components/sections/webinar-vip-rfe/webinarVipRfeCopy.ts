import type { SiteSettingsMap } from "@/lib/supabase"

/** Webinar "RFE, aprobación y espera" (25 nov 2026, 8:00 PM Colombia): Comunidad More, entradas General y VIP. */

/** Identificadores en Supabase (`masterclass_leads.source`) y GHL. */
export const WV_SOURCE = "webinar-vip-rfe-nov-26"
export const WV_EVENT_LABEL = "Webinar VIP — RFE, aprobación y espera (25 nov 2026)"
export const WV_GHL_TAG = "Webinar-VIP-RFE-Nov-26"
export const WV_ROUTE = "/webinar-vip-rfe"

export const WV_TITLE = "Del RFE a la visa: qué hacer en cada etapa de tu EB-2 NIW"
export const WV_CTA_LABEL = "Reservar mi lugar"

/** Los cuatro bloques del webinar (lo que pidió el equipo, ordenado como un antes y un después). */
export const WV_BLOCKS = [
  {
    id: "rfe",
    stage: "Antes",
    title: "Qué está pidiendo USCIS en los RFE y tu plan de evidencias",
    question: "¿Estoy preparado si me llega uno?",
    points: [
      "Qué piden hoy las solicitudes de más evidencia, con casos reales de clientes de MORE",
      "El plan de evidencias para preparar desde ya, aunque todavía no te llegue un RFE",
    ],
  },
  {
    id: "costos",
    stage: "Si llega",
    title: "Costos y trámites cuando llega un RFE",
    question: "¿Cuánto me cuesta y cuánto tiempo tengo?",
    points: [
      "Plazos, qué se presenta y en qué orden",
      "Dónde se va el dinero: cartas nuevas, traducciones y preparación",
    ],
  },
  {
    id: "aprobacion",
    stage: "Después",
    title: "Qué hacer cuando te aprueban la I-140",
    question: "¿Y ahora qué sigue?",
    points: [
      "Qué te da la aprobación y qué no",
      "Los caminos según estés dentro o fuera de EE.UU.",
    ],
  },
  {
    id: "espera",
    stage: "Mientras esperas",
    title: "Tu proyecto en marcha mientras no hay visas disponibles",
    question: "¿Qué hago mientras espero el trámite consular?",
    points: [
      "Cómo leer el boletín de visas y tu fecha de prioridad",
      "Un plan para implementar tu proyecto desde ya, sin perder tiempo",
    ],
  },
] as const

/** Las dos entradas. Precio y link salen de Admin → Configuración → Webinar VIP. */
export type WvTicketId = "general" | "vip"

export type WvTicket = {
  id: WvTicketId
  name: string
  tagline: string
  includes: string[]
  priceKey: keyof SiteSettingsMap
  linkKey: keyof SiteSettingsMap
  highlighted?: boolean
}

export const WV_TICKETS: WvTicket[] = [
  {
    id: "general",
    name: "General",
    tagline: "El webinar en vivo con todo el contenido.",
    includes: [
      "Webinar en vivo con Ivon More",
      "Checklist del plan de evidencias para prepararte ante un RFE",
      "Ronda de preguntas al cierre",
    ],
    priceKey: "wv_general_price",
    linkKey: "wv_general_payment_link",
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "El webinar y una mirada a tu caso.",
    // TODO(confirmar con el equipo): beneficios de la entrada VIP del webinar.
    includes: [
      "Todo lo de la entrada General",
      "Revisión de tu caso (RFE o plan de evidencias) por el equipo de MORE",
      "Grabación en 24 horas",
      "Prioridad para tus preguntas en vivo",
    ],
    priceKey: "wv_vip_price",
    linkKey: "wv_vip_payment_link",
    highlighted: true,
  },
]

export const getWvTicket = (id: WvTicketId): WvTicket => WV_TICKETS.find((t) => t.id === id) ?? WV_TICKETS[0]

export const WV_FAQ = [
  {
    q: "¿Quién puede entrar?",
    a: "Es un webinar para la Comunidad More, con precio de comunidad. Si tienes dudas sobre tu acceso, escríbenos por WhatsApp.",
  },
  {
    q: "¿Qué diferencia hay entre General y VIP?",
    a: "Las dos incluyen el webinar en vivo, el checklist y la ronda de preguntas. La VIP suma la revisión de tu caso por el equipo de MORE, la grabación en 24 horas y prioridad para tus preguntas.",
  },
  {
    q: "¿Es en vivo?",
    a: "Sí, en vivo y virtual. El enlace de acceso te llega por correo y WhatsApp después del pago.",
  },
  {
    q: "¿Sirve si todavía no me llegó un RFE?",
    a: "Sí. El primer bloque es justamente el plan de evidencias para prepararte desde ya.",
  },
  {
    q: "¿Me van a revisar mi caso en vivo?",
    a: "Vemos casos reales de forma anónima y respondemos preguntas al cierre. Una revisión de tu caso es un servicio aparte.",
  },
  {
    q: "¿Esto reemplaza a un abogado?",
    a: "No. Es orientación para ordenar tu estrategia. Las situaciones con procesos abiertos o estatus delicado las derivamos a la abogada aliada.",
  },
] as const

export const WV_PAGE_META = {
  title: `Webinar — ${WV_TITLE} | MORE`,
  description:
    "Webinar en vivo para la Comunidad More: qué piden hoy los RFE, el plan de evidencias, costos, qué hacer con la I-140 aprobada y tu proyecto mientras esperas la visa.",
} as const

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

/** Fecha y hora en Colombia a partir del ISO de settings: { day: "miércoles 25 de noviembre", time: "7:00 PM" }. */
export function eventDateParts(iso: string): { day: string; time: string } | null {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return null
  // Colombia es UTC-5 todo el año (sin horario de verano)
  const d = new Date(t - 5 * 3600 * 1000)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const hora12 = ((h + 11) % 12) + 1
  return {
    day: `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`,
    time: `${hora12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`,
  }
}

/** Etiqueta corta para la cabecera del formulario: "25 NOV · 19:00 COT". */
export function eventShortLabel(iso: string): string {
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return "En vivo"
  const d = new Date(t - 5 * 3600 * 1000)
  const mes = MESES[d.getUTCMonth()].slice(0, 3).toUpperCase()
  return `${d.getUTCDate()} ${mes} · ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} COT`
}
