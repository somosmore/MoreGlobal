/** Webinar VIP "RFE, aprobación y espera" (25 nov 2026): solo para miembros VIP, entrada paga. */

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

export const WV_INCLUDES = [
  "Webinar en vivo con Ivon More",
  "Checklist del plan de evidencias para prepararte ante un RFE",
  "Ronda de preguntas en vivo al cierre",
] as const

export const WV_FAQ = [
  {
    q: "¿Quién puede entrar?",
    a: "Solo miembros VIP de MORE. Si te registras sin serlo, te escribimos para contarte cómo acceder.",
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
  title: `Webinar VIP — ${WV_TITLE} | MORE`,
  description:
    "Webinar en vivo para miembros VIP de MORE: qué piden hoy los RFE, el plan de evidencias, costos, qué hacer con la I-140 aprobada y tu proyecto mientras esperas la visa.",
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
