import { useState } from "react"
import { FileText, Globe, Link as LinkIcon, Eye, Pin, Trash2, Loader2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { normalizeResourceUrl } from "@/lib/resourceUrl"

export type Resource = {
  id: string
  title: string
  description: string | null
  type: "brand" | "strategy" | "playbook" | "landing"
  format: "pdf" | "html" | "link"
  url: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

const TYPE_LABELS: Record<Resource["type"], string> = {
  brand: "Marca",
  strategy: "Estrategia",
  playbook: "Playbook",
  landing: "Landing",
}

const TYPE_COLORS: Record<Resource["type"], string> = {
  brand: "bg-purple-100 text-purple-700",
  strategy: "bg-blue-100 text-blue-700",
  playbook: "bg-amber-100 text-amber-700",
  landing: "bg-green-100 text-green-700",
}

const FORMAT_ICONS: Record<Resource["format"], React.ElementType> = {
  pdf: FileText,
  html: Globe,
  link: LinkIcon,
}

const FORMAT_COLORS: Record<Resource["format"], string> = {
  pdf: "bg-red-50 text-red-500 border-red-100",
  html: "bg-blue-50 text-blue-500 border-blue-100",
  link: "bg-gray-50 text-gray-500 border-gray-100",
}

type ResourceCardProps = {
  resource: Resource
  onDeleted?: (id: string) => void
  onEdit?: (resource: Resource) => void
}

export default function ResourceCard({ resource, onDeleted, onEdit }: ResourceCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const FormatIcon = FORMAT_ICONS[resource.format]
  const formattedDate = new Date(resource.updated_at).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const resolvedUrl = normalizeResourceUrl(resource.url)

  const handleOpen = () => {
    if (!resolvedUrl) return
    window.open(resolvedUrl, "_blank", "noopener,noreferrer")
  }

  const handleDelete = async () => {
    if (!supabase) return
    setDeleting(true)
    const { error } = await supabase.from("resources").delete().eq("id", resource.id)
    setDeleting(false)
    if (!error) {
      onDeleted?.(resource.id)
    }
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      {/* Pin + delete actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {resource.is_pinned && (
          <Pin className="w-3.5 h-3.5 text-orange" aria-label="Fijado" />
        )}
        <button
          onClick={() => onEdit?.(resource)}
          aria-label={`Editar ${resource.title}`}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-navy hover:bg-gray-100 rounded-lg transition-all duration-150"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {!confirmDelete && (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Eliminar recurso"
            className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Inline delete confirmation */}
      {confirmDelete && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 p-4 z-10">
          <Trash2 className="w-6 h-6 text-red-400" />
          <p className="text-sm font-semibold text-navy text-center leading-snug">
            ¿Eliminar "{resource.title}"?
          </p>
          <p className="text-xs text-gray-400 text-center">Esta acción no se puede deshacer.</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-navy bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 rounded-lg transition-colors"
            >
              {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
              {deleting ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-11 h-11 rounded-xl border flex items-center justify-center shrink-0",
            FORMAT_COLORS[resource.format]
          )}
        >
          <FormatIcon className="w-5 h-5" />
        </div>
        <div className="pt-0.5">
          <span
            className={cn(
              "inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full",
              TYPE_COLORS[resource.type]
            )}
          >
            {TYPE_LABELS[resource.type]}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        <h3 className="text-sm font-semibold text-navy leading-snug group-hover:text-orange transition-colors">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        )}
        {resolvedUrl && (
          <p className="text-[11px] text-gray-400 leading-relaxed truncate" title={resolvedUrl}>
            Destino: {resolvedUrl}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-[11px] text-gray-400">
          Actualizado {formattedDate}
        </span>
        <button
          onClick={handleOpen}
          aria-label={`Ver ${resource.title}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleOpen()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange hover:bg-orange/10 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver
        </button>
      </div>
    </div>
  )
}
