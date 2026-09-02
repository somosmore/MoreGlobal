import { useEffect, useMemo, useState } from "react"
import { Check, Copy, Eye, Loader2, Mail, MessageCircle, Smartphone, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Channel = "email" | "sms" | "whatsapp"

type CalendarNotification = {
  id: string
  notificationType: string
  label: string
  timingLabel: string
  subject: string
  badge: string
  headline: string
  intro: string
  body: string
  ctaLabel?: string
  ctaField?: string
  secondaryLabel?: string
  secondaryField?: string
  sms: string
  whatsapp: string
}

type Manifest = {
  version: number
  locale: string
  channels: Channel[]
  events: CalendarNotification[]
}

const CHANNELS: { id: Channel; label: string; icon: typeof Mail; color: string }[] = [
  { id: "email", label: "Email", icon: Mail, color: "text-blue-600 bg-blue-50" },
  { id: "sms", label: "SMS", icon: Smartphone, color: "text-emerald-600 bg-emerald-50" },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600 bg-green-50" },
]

function renderEmail(event: CalendarNotification) {
  const action = event.ctaField
    ? `<p style="margin:24px 0;text-align:center"><a href="${event.ctaField}" style="display:inline-block;background:#F37021;color:#fff;padding:13px 24px;border-radius:8px;text-decoration:none;font-weight:700">${event.ctaLabel}</a></p>`
    : ""
  const secondary = event.secondaryField
    ? `<p style="font-size:13px;text-align:center"><a href="${event.secondaryField}" style="color:#0033A0">${event.secondaryLabel}</a></p>`
    : ""
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${event.subject}</title></head><body style="margin:0;background:#f5f6f8;font-family:Arial,sans-serif;color:#1a2340"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden"><tr><td style="background:#001A52;padding:32px;text-align:center;color:#fff"><div style="color:#F37021;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${event.badge}</div><h1 style="margin:12px 0 0;font-size:26px;line-height:1.2">${event.headline}</h1></td></tr><tr><td style="padding:32px"><p>Hola <strong>{{contact.first_name}}</strong> 👋</p><p>${event.intro}</p><table role="presentation" width="100%" style="background:#001A52;color:#fff;border-radius:12px;margin:24px 0"><tr><td style="padding:20px"><p style="margin:0 0 8px"><strong>{{appointment.title}}</strong></p><p style="margin:0 0 5px">📅 {{appointment.only_start_date}}</p><p style="margin:0 0 5px">🕐 {{appointment.only_start_time}} — {{appointment.only_end_time}} ({{appointment.timezone}})</p><p style="margin:0">📍 {{appointment.meeting_location}}</p></td></tr></table><p>${event.body}</p>${action}${secondary}<p style="color:#777;font-size:13px;text-align:center;margin-top:28px">MORE — Migración con Propósito</p></td></tr></table></td></tr></table></body></html>`
}

function channelValue(event: CalendarNotification, channel: Channel) {
  return channel === "email" ? renderEmail(event) : event[channel]
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
        copied ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-orange/10 hover:text-orange-dark"
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : label}
    </button>
  )
}

function PreviewModal({ event, html, onClose }: { event: CalendarNotification; html: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-admin-lg bg-admin-elevated border border-admin-border admin-portal shadow-none">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-navy">{event.label}</h2>
            <p className="mt-0.5 text-xs text-gray-500">Vista previa de Email · {event.timingLabel}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar vista previa" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-navy">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 bg-gray-100 p-4">
          <iframe title={event.label} srcDoc={html} sandbox="allow-same-origin" className="h-full w-full rounded-lg border border-gray-200 bg-white" />
        </div>
      </div>
    </div>
  )
}

export default function CalendarNotificationTemplatesSection() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<Channel>("email")
  const [preview, setPreview] = useState<CalendarNotification | null>(null)

  useEffect(() => {
    let active = true
    fetch("/calendar-notifications.json")
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo cargar el catálogo")
        return response.json() as Promise<Manifest>
      })
      .then((data) => {
        if (active) setManifest(data)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudo cargar el catálogo")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const selectedChannel = useMemo(() => CHANNELS.find((item) => item.id === channel) ?? CHANNELS[0], [channel])

  if (loading) return <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Cargando plantillas de calendario…</div>
  if (error || !manifest) return <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error ?? "Catálogo no disponible"}</p>

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-navy">Notificaciones generales de calendario GHL</h3>
          <p className="mt-1 text-xs text-gray-500">Matriz reutilizable para todos los calendarios · {manifest.events.length} eventos · español neutro</p>
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white p-1">
          {CHANNELS.map((item) => {
            const Icon = item.icon
            return <button key={item.id} type="button" onClick={() => setChannel(item.id)} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold", channel === item.id ? `${item.color} shadow-sm` : "text-gray-400 hover:text-gray-600")}><Icon className="h-3.5 w-3.5" />{item.label}</button>
          })}
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-800">
        <strong>{selectedChannel.label}:</strong> {channel === "whatsapp" ? "requiere una plantilla aprobada por WhatsApp antes de activarla en GHL." : channel === "sms" ? "usa variables de cita y respeta los límites de segmentos del proveedor." : "se sincroniza con Email Builder mediante el script de GHL."}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {manifest.events.map((event) => {
          const value = channelValue(event, channel)
          return <article key={event.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-4">
              <div className="mb-2 flex items-start justify-between gap-2"><span className="rounded-full bg-orange/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-dark">{event.timingLabel}</span><span className="text-[10px] font-mono text-gray-400">{event.notificationType}</span></div>
              <h4 className="text-sm font-semibold text-gray-900">{event.label}</h4>
              {channel === "email" && <p className="mt-1 line-clamp-2 text-xs text-gray-500">{event.subject}</p>}
              {channel !== "email" && <p className="mt-2 line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-gray-600">{value}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3">
              {channel === "email" && <button type="button" onClick={() => setPreview(event)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-blue-50 hover:text-blue-600"><Eye className="h-3.5 w-3.5" />Vista previa</button>}
              <CopyButton value={value} label={channel === "email" ? "Copiar HTML" : "Copiar mensaje"} />
            </div>
          </article>
        })}
      </div>

      {preview && <PreviewModal event={preview} html={renderEmail(preview)} onClose={() => setPreview(null)} />}
    </section>
  )
}
