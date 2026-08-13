import { useState, useEffect } from "react"
import { Mail, Eye, Copy, Check, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type EmailTemplate = {
  id: string
  name: string
  description: string
  file: string
  group: "masterclass" | "taller" | "ivon" | "sandra"
}

const TEMPLATES: EmailTemplate[] = [
  {
    id: "bienvenida-mc",
    name: "Bienvenida Masterclass",
    description: "Email de confirmación post-registro con calendario y WhatsApp",
    file: "bienvenida-masterclass.html",
    group: "masterclass",
  },
  {
    id: "previo-mc",
    name: "Recordatorio 24h Masterclass",
    description: "Recordatorio un día antes del evento con preparación",
    file: "previo-masterclass.html",
    group: "masterclass",
  },
  {
    id: "recordatorio-mc",
    name: "Día del Evento Masterclass",
    description: "Recordatorio el día del evento con link de Zoom",
    file: "recordatorio-masterclass.html",
    group: "masterclass",
  },
  {
    id: "bienvenida-taller",
    name: "Bienvenida Taller Cambio de Estatus",
    description: "Confirmación post-registro + link de inscripción Zoom + WhatsApp",
    file: "bienvenida-taller-redflags.html",
    group: "taller",
  },
  {
    id: "previo-taller",
    name: "Recordatorio 24h Taller Cambio de Estatus",
    description: "Recordatorio un día antes (5 ago) con link Zoom",
    file: "previo-taller-redflags.html",
    group: "taller",
  },
  {
    id: "hoy-manana-taller",
    name: "Día del evento — Mañana",
    description: "6 ago 9:00 AM — recordatorio matutino del taller",
    file: "recordatorio-taller-redflags-manana.html",
    group: "taller",
  },
  {
    id: "hoy-1h-taller",
    name: "Día del evento — 1 hora antes",
    description: "6 ago 6:00 PM — falta 1 hora para el taller",
    file: "recordatorio-taller-redflags-1h.html",
    group: "taller",
  },
  {
    id: "hoy-menos-1h-taller-corto",
    name: "Día del evento — Menos de 1h (corto)",
    description: "Copy corto I-94 + CTA Zoom — listo para blast GHL",
    file: "recordatorio-taller-cambio-estatus-menos-1h.html",
    group: "taller",
  },
  {
    id: "recordatorio-taller",
    name: "Día del evento — En vivo",
    description: "6 ago 7:00 PM — estamos en vivo, entrar a Zoom",
    file: "recordatorio-taller-redflags.html",
    group: "taller",
  },
  {
    id: "recordatorio-taller-30m",
    name: "Día del evento — +30 min",
    description: "6 ago 7:30 PM — llevamos 30 min, aún estás a tiempo",
    file: "recordatorio-taller-cambio-estatus-30m.html",
    group: "taller",
  },
  {
    id: "confirmacion-ivon",
    name: "Confirmación Agenda",
    description: "Confirmación inmediata al agendar sesión con Ivon",
    file: "confirmacion-agenda.html",
    group: "ivon",
  },
  {
    id: "recordatorio-24h-ivon",
    name: "Recordatorio 24h",
    description: "Recordatorio un día antes de la sesión con Ivon",
    file: "recordatorio-agenda-24h.html",
    group: "ivon",
  },
  {
    id: "recordatorio-1h-ivon",
    name: "Recordatorio 1h",
    description: "Recordatorio una hora antes de la sesión con Ivon",
    file: "recordatorio-agenda-1h.html",
    group: "ivon",
  },
  {
    id: "confirmacion-sandra",
    name: "Confirmación Agenda",
    description: "Confirmación inmediata al agendar sesión con Sandra",
    file: "confirmacion-agenda-sandra.html",
    group: "sandra",
  },
  {
    id: "recordatorio-24h-sandra",
    name: "Recordatorio 24h",
    description: "Recordatorio un día antes de la sesión con Sandra",
    file: "recordatorio-agenda-24h-sandra.html",
    group: "sandra",
  },
  {
    id: "recordatorio-1h-sandra",
    name: "Recordatorio 1h",
    description: "Recordatorio una hora antes de la sesión con Sandra",
    file: "recordatorio-agenda-1h-sandra.html",
    group: "sandra",
  },
]

const GROUPS = [
  { id: "masterclass" as const, label: "Masterclass", color: "bg-blue-500" },
  { id: "taller" as const, label: "Taller Cambio de Estatus", color: "bg-red-500" },
  { id: "ivon" as const, label: "Agenda Ivon", color: "bg-orange-500" },
  { id: "sandra" as const, label: "Agenda Sandra", color: "bg-purple-500" },
]

function EmailPreviewModal({
  template,
  onClose,
}: {
  template: EmailTemplate
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/emails/${template.file}`)
      .then((r) => r.text())
      .then((text) => {
        setHtml(text)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [template.file])

  const handleCopy = async () => {
    if (!html) return
    await navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl h-[85vh] bg-admin-elevated rounded-admin-lg border border-admin-border overflow-hidden flex flex-col admin-portal">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {template.name}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {template.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                copied
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copiado" : "Copiar HTML"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-100 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : html ? (
            <iframe
              srcDoc={html}
              title={template.name}
              className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200"
              sandbox="allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-gray-500">
              No se pudo cargar la plantilla
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EmailTemplateCard({
  template,
  onPreview,
}: {
  template: EmailTemplate
  onPreview: (t: EmailTemplate) => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      const res = await fetch(`/emails/${template.file}`)
      const html = await res.text()
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const group = GROUPS.find((g) => g.id === template.group)

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          {group && (
            <span
              className={cn(
                "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white rounded-full",
                group.color
              )}
            >
              {group.label}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          {template.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {template.description}
        </p>
      </div>
      <div className="flex border-t border-gray-100">
        <button
          onClick={() => onPreview(template)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Visualizar
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={handleCopy}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors",
            copied
              ? "text-green-600 bg-green-50/50"
              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50/50"
          )}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copiado" : "Copiar código"}
        </button>
      </div>
    </div>
  )
}

export default function EmailTemplatesSection() {
  const [previewTemplate, setPreviewTemplate] =
    useState<EmailTemplate | null>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(GROUPS.map((g) => g.id))
  )

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section>
      {GROUPS.map((group) => {
        const groupTemplates = TEMPLATES.filter((t) => t.group === group.id)
        const isExpanded = expandedGroups.has(group.id)

        return (
          <div key={group.id} className="mb-6">
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center gap-2 mb-3 group/header"
            >
              <span
                className={cn("w-2 h-2 rounded-full", group.color)}
              />
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-hover/header:text-gray-600 transition-colors">
                {group.label}
              </h3>
              <span className="text-xs text-gray-300">
                ({groupTemplates.length})
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-gray-300 transition-transform",
                  !isExpanded && "-rotate-90"
                )}
              />
            </button>
            {isExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupTemplates.map((template) => (
                  <EmailTemplateCard
                    key={template.id}
                    template={template}
                    onPreview={setPreviewTemplate}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}

      {previewTemplate && (
        <EmailPreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </section>
  )
}
