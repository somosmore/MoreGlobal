/**
 * Eventos de calendario del taller (Día 1 y Día 2, 19:00 hora Colombia = 00:00 UTC del día siguiente).
 * Duración estimada: 2 horas por día (ajustar si cambia).
 */
const DAYS = [
  {
    title: "Taller MORE · Día 1: Diseña tu ruta",
    startUtc: "20261124T000000Z",
    endUtc: "20261124T020000Z",
  },
  {
    title: "Taller MORE · Día 2: Destraba tu proceso",
    startUtc: "20261125T000000Z",
    endUtc: "20261125T020000Z",
  },
] as const

const DETAILS =
  "Taller virtual en vivo con Ivon More (7:00 PM hora Colombia). El acceso a Zoom te llega por correo y WhatsApp antes del taller."

/** Link de "Agregar a Google Calendar" para cada día. */
export const googleCalendarLinks = () =>
  DAYS.map((d, i) => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: d.title,
      dates: `${d.startUtc}/${d.endUtc}`,
      details: DETAILS,
      location: "Zoom (enlace por correo y WhatsApp)",
    })
    return { label: `Día ${i + 1}`, href: `https://calendar.google.com/calendar/render?${params.toString()}` }
  })

/** Descarga un .ics con los dos días (Apple Calendar, Outlook, etc.). */
export function downloadIcs() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const events = DAYS.map(
    (d, i) => [
      "BEGIN:VEVENT",
      `UID:taller-more-23nov-dia${i + 1}@moremigracion.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${d.startUtc}`,
      `DTEND:${d.endUtc}`,
      `SUMMARY:${d.title}`,
      `DESCRIPTION:${DETAILS}`,
      "LOCATION:Zoom (enlace por correo y WhatsApp)",
      "END:VEVENT",
    ].join("\r\n"),
  )
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MORE//Taller 23nov//ES", ...events, "END:VCALENDAR"].join("\r\n")
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = "taller-more-23-24-nov.ics"
  a.click()
  URL.revokeObjectURL(a.href)
}
