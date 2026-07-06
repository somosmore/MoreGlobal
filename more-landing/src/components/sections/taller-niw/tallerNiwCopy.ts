export type TallerNiwFormVariant = "default" | "ads"

export type TallerNiwFormCopy = {
  formEyebrow: string
  formHeadlineBefore: string
  formHeadlineHighlight: string
  formSubcopy: string
  calendarTitle: string
  calendarDetails: string
  icsSummary: string
  icsDescription: string
  expiredBody: string
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

const FORM_COPY: Record<TallerNiwFormVariant, TallerNiwFormCopy> = {
  default: {
    formEyebrow: "Taller gratuito · Lunes 13 de julio 2026",
    formHeadlineBefore: "Antes de pagarle a un",
    formHeadlineHighlight: "abogado",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    calendarTitle: "Taller: Red flags de los abogados de inmigración — MORE",
    calendarDetails:
      "Taller gratuito en vivo con Ivon More.\\nLas señales de alerta que casi nadie te confiesa antes de pagarle a un abogado de inmigración.\\n\\nLink de acceso se enviará por WhatsApp y email.",
    icsSummary: "Taller: Red flags de los abogados de inmigración — MORE",
    icsDescription:
      "Taller gratuito en vivo con Ivon More.\\nLas señales de alerta que casi nadie te confiesa antes de pagarle a un abogado de inmigración.\\nLink de acceso se enviará por WhatsApp y email.",
    expiredBody:
      "El taller sobre red flags de los abogados de inmigración ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
  },
  ads: {
    formEyebrow: "Taller gratuito · Lunes 13 de julio 2026",
    formHeadlineBefore: "Antes de pagarle a un",
    formHeadlineHighlight: "abogado",
    formSubcopy: "Regístrate en 30 segundos y asegura tu lugar.",
    calendarTitle: "Taller: Red flags de abogados — MORE",
    calendarDetails:
      "Taller gratuito en vivo con Ivon More.\\nSeñales de alerta antes de pagarle a un abogado.\\n\\nLink de acceso se enviará por WhatsApp y email.",
    icsSummary: "Taller: Red flags de abogados — MORE",
    icsDescription:
      "Taller gratuito en vivo con Ivon More.\\nSeñales de alerta antes de pagarle a un abogado.\\nLink de acceso se enviará por WhatsApp y email.",
    expiredBody:
      "Este taller ya fue realizado. Síguenos en redes para enterarte de los próximos eventos.",
  },
}

export const getTallerNiwFormCopy = (
  variant: TallerNiwFormVariant = "default"
): TallerNiwFormCopy => FORM_COPY[variant]

export const buildGoogleCalendarUrl = (copy: TallerNiwFormCopy): string => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: copy.calendarTitle,
    dates: "20260713T190000/20260713T210000",
    ctz: "America/Bogota",
    details: copy.calendarDetails,
    location: "Online (Zoom)",
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export const buildIcsContent = (copy: TallerNiwFormCopy): string =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MORE//Taller Red Flags//ES",
    "BEGIN:VEVENT",
    "DTSTART;TZID=America/Bogota:20260713T190000",
    "DTEND;TZID=America/Bogota:20260713T210000",
    `SUMMARY:${copy.icsSummary}`,
    `DESCRIPTION:${copy.icsDescription}`,
    "LOCATION:Online (Zoom)",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
