import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ExternalLink,
  Eye,
  ArrowRight,
  Globe,
  Sparkles,
  FileEdit,
  Clock,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import type { LandingProject, GeneratedLandingJson } from "@/lib/supabase"
import { Switch } from "@/components/ui/switch"
import ResourcePreviewModal from "./ResourcePreviewModal"

function toLocalInput(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

type RuntimeStatus = "active" | "inactive" | "scheduled" | "expired"

function getRuntimeStatus(
  isActive: boolean,
  activateAt: string | null,
  deactivateAt: string | null
): RuntimeStatus {
  const now = Date.now()
  if (deactivateAt && now >= new Date(deactivateAt).getTime()) return "expired"
  if (activateAt && now < new Date(activateAt).getTime()) return "scheduled"
  if (!isActive) return "inactive"
  return "active"
}

const STATUS_BADGES: Record<
  RuntimeStatus,
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Disponible",
    className: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  inactive: {
    label: "Apagada",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  scheduled: {
    label: "Programada",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  expired: {
    label: "Expirada",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
}

function scheduleLabel(activateAt: string | null, deactivateAt: string | null): string | null {
  const now = Date.now()
  if (activateAt && new Date(activateAt).getTime() > now) {
    const dt = new Date(activateAt)
    return `Se activa el ${dt.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
    })} ${dt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
  }
  if (deactivateAt) {
    const dt = new Date(deactivateAt)
    if (dt.getTime() > now) {
      return `Se desactiva el ${dt.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
      })} ${dt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
    }
    return "Periodo finalizado"
  }
  return null
}

const STATUS_CONFIG = {
  draft: {
    label: "Borrador",
    className: "bg-gray-100 text-gray-500",
  },
  complete: {
    label: "Completo",
    className: "bg-blue-100 text-blue-600",
  },
  generated: {
    label: "Generado",
    className: "bg-green-100 text-green-700",
  },
}

type LandingPreviewCardProps = {
  project: LandingProject
  onToggleActive?: (id: string, isActive: boolean) => void
}

export default function LandingPreviewCard({ project, onToggleActive }: LandingPreviewCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [active, setActive] = useState(project.is_active)
  const [toggling, setToggling] = useState(false)
  const [activateAt, setActivateAt] = useState(project.activate_at)
  const [deactivateAt, setDeactivateAt] = useState(project.deactivate_at)
  const [activateInput, setActivateInput] = useState(toLocalInput(project.activate_at))
  const [deactivateInput, setDeactivateInput] = useState(toLocalInput(project.deactivate_at))
  const [savingField, setSavingField] = useState<null | "activate_at" | "deactivate_at">(null)
  const [feedback, setFeedback] = useState<null | { type: "success" | "error"; msg: string }>(null)
  const isBuiltIn = !!(project.tech_config as Record<string, unknown>)?.built_in
  const [showSchedule, setShowSchedule] = useState(
    isBuiltIn || !!project.activate_at || !!project.deactivate_at
  )

  function flashFeedback(type: "success" | "error", msg: string) {
    setFeedback({ type, msg })
    window.setTimeout(() => setFeedback(null), 2500)
  }

  async function handleToggle(checked: boolean) {
    if (!supabase) return
    setToggling(true)
    const { error } = await supabase
      .from("landing_projects")
      .update({ is_active: checked })
      .eq("id", project.id)
    setToggling(false)
    if (error) {
      flashFeedback("error", "No se pudo guardar el cambio. Revisá tus permisos.")
      return
    }
    setActive(checked)
    onToggleActive?.(project.id, checked)
    flashFeedback("success", checked ? "Landing activada" : "Landing desactivada")
  }

  async function saveDate(field: "activate_at" | "deactivate_at", value: string) {
    let iso: string | null = null
    if (value) {
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) {
        flashFeedback("error", "Fecha inválida")
        return
      }
      iso = parsed.toISOString()
    }

    const previous = field === "activate_at" ? activateAt : deactivateAt
    if (iso === previous) return

    if (field === "activate_at") setActivateAt(iso)
    else setDeactivateAt(iso)

    if (!supabase) return
    setSavingField(field)
    const { error } = await supabase
      .from("landing_projects")
      .update({ [field]: iso })
      .eq("id", project.id)
    setSavingField(null)

    if (error) {
      if (field === "activate_at") {
        setActivateAt(previous)
        setActivateInput(toLocalInput(previous))
      } else {
        setDeactivateAt(previous)
        setDeactivateInput(toLocalInput(previous))
      }
      flashFeedback("error", "No se pudo guardar la fecha. Revisá tus permisos.")
      return
    }

    flashFeedback("success", iso ? "Fecha guardada" : "Fecha eliminada")
  }

  async function handleClearDate(field: "activate_at" | "deactivate_at") {
    if (field === "activate_at") setActivateInput("")
    else setDeactivateInput("")
    await saveDate(field, "")
  }

  const json = project.generated_json as GeneratedLandingJson | null
  const hero = json?.hero
  const status = STATUS_CONFIG[project.status]
  const hasLiveUrl = !!project.live_url
  const hasContent = !!hero?.h1 || isBuiltIn
  const runtimeStatus = getRuntimeStatus(active, activateAt, deactivateAt)
  const statusBadge = STATUS_BADGES[runtimeStatus]

  const formattedDate = new Date(project.updated_at).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col">
        {/* Mock browser chrome */}
        <div className="bg-gray-100 border-b border-gray-200 px-3 py-2 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-2 bg-white border border-gray-200 rounded-md px-2 py-0.5 flex items-center gap-1.5">
            <Globe className="w-2.5 h-2.5 text-gray-400 shrink-0" />
            <span className="text-[10px] text-gray-400 truncate font-mono">
              {hasLiveUrl ? project.live_url : "sin-url-live.com"}
            </span>
          </div>
          {hasLiveUrl && (
            <a
              href={project.live_url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Abrir sitio en nueva pestaña"
              className="p-1 text-gray-400 hover:text-orange transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Preview content */}
        <div
          className={cn(
            "relative flex-1 min-h-[140px] flex flex-col justify-center px-5 py-4",
            hasLiveUrl && "cursor-pointer"
          )}
          onClick={hasLiveUrl ? () => setPreviewOpen(true) : undefined}
        >
          {hasContent ? (
            <div className="space-y-2">
              {isBuiltIn ? (
                <>
                  <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-navy-mid/10 text-navy-mid rounded-full">
                    Landing integrada
                  </span>
                  <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2">
                    {project.name}
                  </h3>
                  {project.route && (
                    <p className="text-[11px] text-gray-500">
                      Ruta: <span className="font-mono">{project.route}</span>
                    </p>
                  )}
                </>
              ) : (
                <>
                  {hero?.badge && (
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-orange/10 text-orange rounded-full">
                      {hero.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-navy leading-snug line-clamp-2">
                    {hero?.h1}
                  </h3>
                  {hero?.h2 && (
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {hero.h2}
                    </p>
                  )}
                  {hero?.cta_primary && (
                    <div className="pt-1">
                      <span className="inline-block px-3 py-1 text-[11px] font-semibold bg-orange text-white rounded-lg">
                        {hero.cta_primary}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                {project.status === "draft" ? (
                  <FileEdit className="w-5 h-5 text-gray-400" />
                ) : (
                  <Sparkles className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-400">
                {project.status === "draft"
                  ? "Wizard incompleto — sin contenido generado"
                  : "Esperando generación con Gemini"}
              </p>
            </div>
          )}

          {hasLiveUrl && (
            <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-xs font-semibold text-navy">
                <Eye className="w-3.5 h-3.5" />
                Ver sitio live
              </div>
            </div>
          )}
        </div>

        {/* Active toggle + runtime status */}
        <div className="px-5 pt-3 pb-1 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Switch
              checked={active}
              onCheckedChange={handleToggle}
              disabled={toggling}
              aria-label={active ? "Desactivar landing" : "Activar landing"}
            />
            <span
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full border",
                statusBadge.className
              )}
              title={
                runtimeStatus === "active"
                  ? "La página está disponible públicamente"
                  : runtimeStatus === "scheduled"
                  ? "La página aún no se activó"
                  : runtimeStatus === "expired"
                  ? "La fecha de desactivación ya pasó"
                  : "La landing está apagada manualmente"
              }
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", statusBadge.dot)} />
              {statusBadge.label}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.route && (
              <span className="text-[11px] text-gray-400 font-mono truncate max-w-[100px]">
                {project.route}
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors",
                showSchedule
                  ? "text-orange bg-orange/10"
                  : "text-gray-500 hover:text-navy hover:bg-gray-100"
              )}
              aria-label="Programar fechas"
              aria-expanded={showSchedule}
            >
              <Calendar className="w-3 h-3" />
              Programar
            </button>
          </div>
        </div>

        {showSchedule && (
          <div className="px-5 pb-2 pt-2 space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-gray-500 w-16 shrink-0">Activar</label>
              <input
                type="datetime-local"
                value={activateInput}
                onChange={(e) => setActivateInput(e.target.value)}
                onBlur={(e) => saveDate("activate_at", e.target.value)}
                disabled={savingField === "activate_at"}
                className="flex-1 text-[11px] border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange/40 disabled:opacity-50"
              />
              {activateAt && (
                <button
                  type="button"
                  onClick={() => handleClearDate("activate_at")}
                  disabled={savingField === "activate_at"}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                  aria-label="Limpiar fecha de activación"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] text-gray-500 w-16 shrink-0">Desactivar</label>
              <input
                type="datetime-local"
                value={deactivateInput}
                onChange={(e) => setDeactivateInput(e.target.value)}
                onBlur={(e) => saveDate("deactivate_at", e.target.value)}
                disabled={savingField === "deactivate_at"}
                className="flex-1 text-[11px] border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange/40 disabled:opacity-50"
              />
              {deactivateAt && (
                <button
                  type="button"
                  onClick={() => handleClearDate("deactivate_at")}
                  disabled={savingField === "deactivate_at"}
                  className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                  aria-label="Limpiar fecha de desactivación"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 min-h-[14px]">
              {scheduleLabel(activateAt, deactivateAt) ? (
                <p className="text-[10px] text-orange font-medium">
                  {scheduleLabel(activateAt, deactivateAt)}
                </p>
              ) : (
                <p className="text-[10px] text-gray-400">
                  Sin programación. Se controla solo con el switch.
                </p>
              )}
              {feedback && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-medium",
                    feedback.type === "success" ? "text-green-600" : "text-red-500"
                  )}
                >
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {feedback.msg}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 pb-4 pt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={cn(
                "shrink-0 px-2 py-0.5 text-[11px] font-semibold rounded-full",
                status.className
              )}
            >
              {status.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 truncate">
              <Clock className="w-3 h-3 shrink-0" />
              {formattedDate}
            </span>
          </div>

          <Link
            to={`/admin/projects/${project.id}`}
            aria-label={`Abrir detalle de ${project.name}`}
            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-orange hover:text-orange-dark transition-colors"
          >
            Detalle
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="px-5 pb-4 -mt-2">
          <p className="text-xs text-gray-400 truncate" title={project.name}>
            {project.name}
          </p>
        </div>
      </div>

      {hasLiveUrl && project.live_url && (
        <ResourcePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={project.name}
          url={project.live_url}
          format="link"
        />
      )}
    </>
  )
}
