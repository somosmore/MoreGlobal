import { useState } from "react"
import { Link } from "react-router-dom"
import { ExternalLink, Eye, ArrowRight, Globe, Sparkles, FileEdit, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import type { LandingProject, GeneratedLandingJson } from "@/lib/supabase"
import { Switch } from "@/components/ui/switch"
import ResourcePreviewModal from "./ResourcePreviewModal"

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

  async function handleToggle(checked: boolean) {
    if (!supabase) return
    setToggling(true)
    const { error } = await supabase
      .from("landing_projects")
      .update({ is_active: checked })
      .eq("id", project.id)
    setToggling(false)
    if (!error) {
      setActive(checked)
      onToggleActive?.(project.id, checked)
    }
  }

  const json = project.generated_json as GeneratedLandingJson | null
  const hero = json?.hero
  const status = STATUS_CONFIG[project.status]
  const hasLiveUrl = !!project.live_url
  const hasContent = !!hero?.h1

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

        {/* Active toggle */}
        <div className="px-5 pt-3 pb-1 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={active}
              onCheckedChange={handleToggle}
              disabled={toggling}
              aria-label={active ? "Desactivar landing" : "Activar landing"}
            />
            <span
              className={cn(
                "px-2 py-0.5 text-[11px] font-semibold rounded-full",
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {active ? "Activa" : "Inactiva"}
            </span>
          </div>
          {project.route && (
            <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">
              {project.route}
            </span>
          )}
        </div>

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
