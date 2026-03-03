import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  Sparkles,
  FileEdit,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { LandingProject, ProjectStatus, Client } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  draft: { label: "Borrador", color: "text-gray-500 bg-gray-100", icon: FileText },
  complete: { label: "Completo", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 },
  generated: { label: "Generado", color: "text-green-600 bg-green-50", icon: Sparkles },
}

export default function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<LandingProject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase
      .from("landing_projects")
      .select("*, clients(id, name, company)")
      .order("updated_at", { ascending: false })
    setProjects((data as LandingProject[]) ?? [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Seguro que querés eliminar este proyecto? Esta acción no se puede deshacer.")) return
    setDeleting(id)
    await supabase.from("landing_projects").delete().eq("id", id)
    setProjects((p) => p.filter((proj) => proj.id !== id))
    setDeleting(null)
  }

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as Client | null)?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.clients as Client | null)?.company?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("es", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A3A4A]">Proyectos de Landing</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Creá y gestioná landings con ayuda de Gemini
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/projects/new")}
          className="gap-2 shrink-0"
          variant="gold"
        >
          <Plus className="w-4 h-4" />
          Nuevo proyecto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre de proyecto o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "draft", "complete", "generated"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-150",
                statusFilter === s
                  ? "bg-[#2A3A4A] text-white border-[#2A3A4A]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              )}
            >
              {s === "all"
                ? "Todos"
                : STATUS_CONFIG[s as ProjectStatus]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Cargando proyectos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
          <FileText className="w-10 h-10 text-gray-300" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              {search || statusFilter !== "all"
                ? "No hay proyectos que coincidan con los filtros."
                : "Todavía no hay proyectos."}
            </p>
            {!search && statusFilter === "all" && (
              <p className="text-xs text-gray-400 mt-1">
                Creá tu primer proyecto con el botón de arriba.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Proyecto
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Cliente
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Estado
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actualizado
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((project) => {
                  const status = STATUS_CONFIG[project.status]
                  const StatusIcon = status.icon
                  const client = project.clients as Client | null

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#2A3A4A] group-hover:text-[#F37021] transition-colors truncate max-w-[200px]">
                          {project.name}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {client ? (
                          <div>
                            <p className="text-sm text-[#2A3A4A]">{client.name}</p>
                            {client.company && (
                              <p className="text-xs text-gray-400">{client.company}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sin cliente</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                            status.color
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(project.updated_at)}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 justify-end">
                          {project.status === "generated" && (
                            <Link
                              to={`/admin/projects/${project.id}`}
                              className="p-2 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Ver resultado"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            className="p-2 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <FileEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            disabled={deleting === project.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map((project) => {
              const status = STATUS_CONFIG[project.status]
              const StatusIcon = status.icon
              const client = project.clients as Client | null

              return (
                <div key={project.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#2A3A4A] truncate">
                        {project.name}
                      </p>
                      {client && (
                        <p className="text-xs text-gray-400 truncate">
                          {client.name}
                          {client.company ? ` · ${client.company}` : ""}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0",
                        status.color
                      )}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDate(project.updated_at)}
                    </span>
                    <div className="flex items-center gap-1">
                      {project.status === "generated" && (
                        <Link
                          to={`/admin/projects/${project.id}`}
                          className="p-1.5 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FileEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} proyecto{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
