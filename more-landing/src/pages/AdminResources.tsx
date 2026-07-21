import { useState, useEffect } from "react"
import {
  Library,
  Plus,
  X,
  Loader2,
  LayoutGrid,
  FileText,
  Globe,
  Link as LinkIcon,
  Palette,
  BookOpen,
  Layers,
  Mail,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Resource, ResourceInsert, LandingProject } from "@/lib/supabase"
import ResourceCard from "@/components/admin/resources/ResourceCard"
import LandingPreviewCard from "@/components/admin/resources/LandingPreviewCard"
import EmailTemplatesSection from "@/components/admin/resources/EmailTemplatesSection"
import { cn } from "@/lib/utils"
import { normalizeResourceUrl } from "@/lib/resourceUrl"

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "all" | "brand" | "strategy" | "playbook" | "landings" | "emails"

const TABS: { id: Tab; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "all",
    label: "Todos",
    icon: LayoutGrid,
    description: "Vista completa de todos los documentos, referencias estratégicas y landings del proyecto.",
  },
  {
    id: "brand",
    label: "Marca",
    icon: Palette,
    description: "Manual de marca, paleta de colores, tipografías, usos del logo y guías de identidad visual.",
  },
  {
    id: "strategy",
    label: "Estrategia",
    icon: BookOpen,
    description: "Blueprints, planes de negocio, documentos de posicionamiento y roadmaps estratégicos.",
  },
  {
    id: "playbook",
    label: "Playbooks",
    icon: Layers,
    description: "Guías de proceso, checklists operativos y procedimientos internos del equipo.",
  },
  {
    id: "landings",
    label: "Landings",
    icon: Globe,
    description: "Páginas web de MORE. Cada tarjeta muestra el copy del hero",
  },
  {
    id: "emails",
    label: "Emails",
    icon: Mail,
    description: "Plantillas de email para GHL: masterclass, taller Red Flags, agendas Ivon/Sandra.",
  },
]

// ─── Add Resource Modal ───────────────────────────────────────────────────────

type AddModalProps = {
  onClose: () => void
  onCreated: (r: Resource) => void
}

function AddResourceModal({ onClose, onCreated }: AddModalProps) {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ResourceInsert, "is_pinned">>({
    title: "",
    description: "",
    type: "strategy",
    format: "link",
    url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !form.title.trim() || !form.url.trim()) {
      setSubmitError("Completá los campos obligatorios antes de guardar.")
      return
    }

    setSubmitError(null)
    setSaving(true)
    const payload: ResourceInsert = {
      ...form,
      url: normalizeResourceUrl(form.url),
      is_pinned: false,
    }
    const { data, error } = await supabase
      .from("resources")
      .insert(payload)
      .select()
      .single()
    setSaving(false)

    if (error) {
      setSubmitError(error.message || "No se pudo crear el recurso. Intentá nuevamente.")
      return
    }

    if (!error && data) {
      onCreated(data as Resource)
      onClose()
    }
  }

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setSubmitError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-navy">Agregar recurso</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ej: Guía de tono de voz"
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descripción breve del recurso..."
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tipo
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as Resource["type"])}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
              >
                <option value="brand">Marca</option>
                <option value="strategy">Estrategia</option>
                <option value="playbook">Playbook</option>
                <option value="landing">Landing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Formato
              </label>
              <select
                value={form.format}
                onChange={(e) => set("format", e.target.value as Resource["format"])}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="html">HTML</option>
                <option value="link">Link externo</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              URL *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {form.format === "pdf" ? (
                  <FileText className="w-3.5 h-3.5" />
                ) : form.format === "html" ? (
                  <Globe className="w-3.5 h-3.5" />
                ) : (
                  <LinkIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <input
                type="text"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
                placeholder={
                  form.format === "link"
                    ? "https://notion.so/mi-recurso"
                    : form.format === "html"
                    ? "/ruta-de-la-pagina"
                    : "/resources/archivo.pdf"
                }
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-navy rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim() || !form.url.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-orange text-white rounded-xl hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Guardando..." : "Agregar recurso"}
            </button>
          </div>
          {submitError && (
            <p className="text-xs text-red-500 leading-relaxed">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  )
}

type EditModalProps = {
  resource: Resource
  onClose: () => void
  onUpdated: (resource: Resource) => void
}

function EditResourceModal({ resource, onClose, onUpdated }: EditModalProps) {
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ResourceInsert, "is_pinned">>({
    title: resource.title,
    description: resource.description ?? "",
    type: resource.type,
    format: resource.format,
    url: resource.url,
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setSubmitError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !form.title.trim() || !form.url.trim()) {
      setSubmitError("Completá los campos obligatorios antes de guardar.")
      return
    }

    setSubmitError(null)
    const payload = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      type: form.type,
      format: form.format,
      url: normalizeResourceUrl(form.url),
    }

    setSaving(true)
    const { data, error } = await supabase
      .from("resources")
      .update(payload)
      .eq("id", resource.id)
      .select()
      .single()
    setSaving(false)

    if (error) {
      setSubmitError(error.message || "No se pudo actualizar el recurso. Intentá nuevamente.")
      return
    }

    if (!error && data) {
      onUpdated(data as Resource)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-navy">Editar recurso</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Descripción
            </label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tipo
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value as Resource["type"])}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
              >
                <option value="brand">Marca</option>
                <option value="strategy">Estrategia</option>
                <option value="playbook">Playbook</option>
                <option value="landing">Landing</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Formato
              </label>
              <select
                value={form.format}
                onChange={(e) => set("format", e.target.value as Resource["format"])}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="html">HTML</option>
                <option value="link">Link externo</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              URL *
            </label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-navy rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim() || !form.url.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-orange text-white rounded-xl hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
          {submitError && (
            <p className="text-xs text-red-500 leading-relaxed">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
        <Library className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">No hay recursos en "{label}"</p>
      <p className="text-xs text-gray-400">Agregá el primero con el botón de arriba.</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminResources() {
  const [activeTab, setActiveTab] = useState<Tab>("all")
  const [resources, setResources] = useState<Resource[]>([])
  const [landings, setLandings] = useState<LandingProject[]>([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [loadingLandings, setLoadingLandings] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

  useEffect(() => {
    if (!supabase) {
      const timer = window.setTimeout(() => {
        setLoadingResources(false)
        setLoadingLandings(false)
      }, 0)
      return () => window.clearTimeout(timer)
    }

    supabase
      .from("resources")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (data) setResources(data as Resource[])
        setLoadingResources(false)
      })

    supabase
      .from("landing_projects")
      .select("*, clients(*)")
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        if (data) setLandings(data as LandingProject[])
        setLoadingLandings(false)
      })
  }, [])

  const handleResourceCreated = (r: Resource) => {
    setResources((prev) => [r, ...prev])
  }

  const handleResourceDeleted = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  const handleResourceUpdated = (updatedResource: Resource) => {
    setResources((prev) =>
      prev.map((resource) => (resource.id === updatedResource.id ? updatedResource : resource))
    )
  }

  const filteredResources =
    activeTab === "all"
      ? resources
      : activeTab === "landings"
      ? resources.filter((r) => r.type === "landing")
      : resources.filter((r) => r.type === activeTab)

  const showResources = (activeTab !== "landings" && activeTab !== "emails") || filteredResources.length > 0
  const showLandings = activeTab === "all" || activeTab === "landings"
  const showEmails = activeTab === "all" || activeTab === "emails"

  const isLoading = loadingResources || (showLandings && loadingLandings)

  const totalCount =
    activeTab === "all"
      ? resources.length + landings.length
      : activeTab === "landings"
      ? filteredResources.length + landings.length
      : filteredResources.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange/10 flex items-center justify-center">
                <Library className="w-4 h-4 text-orange" />
              </div>
              <h1 className="text-lg font-bold text-navy">Biblioteca de Recursos</h1>
            </div>
            <p className="text-sm text-gray-500 pl-10.5">
              Manual de marca, estrategia, playbooks y landings en un solo lugar.
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            aria-label="Agregar recurso"
            className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-orange text-white rounded-xl hover:bg-orange-dark transition-colors shadow-sm shadow-orange/20"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Agregar recurso</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mt-5 flex items-center gap-1 overflow-x-auto pb-px">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-label={label}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-150",
                activeTab === id
                  ? "bg-navy text-white shadow-sm"
                  : "text-gray-500 hover:text-navy hover:bg-gray-100"
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs text-gray-400 font-medium pr-1">
            {isLoading ? "..." : `${totalCount} recurso${totalCount !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Tab description */}
        <div className="max-w-6xl mx-auto mt-3">
          <p className="text-xs text-gray-400 leading-relaxed">
            {TABS.find((t) => t.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {showResources && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Documentos y referencias
                  </h2>
                )}
                {activeTab === "landings" && filteredResources.length > 0 && (
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Referencias de landings
                  </h2>
                )}
                {filteredResources.length === 0 && activeTab !== "landings" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <EmptyState label={TABS.find((t) => t.id === activeTab)?.label ?? "esta categoría"} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onDeleted={handleResourceDeleted}
                        onEdit={setEditingResource}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {showLandings && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Landings del proyecto
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landings.length === 0 ? (
                    <EmptyState label="Landings" />
                  ) : (
                    landings.map((project) => (
                      <LandingPreviewCard key={project.id} project={project} />
                    ))
                  )}
                </div>
              </section>
            )}

            {showEmails && (
              <section>
                {activeTab === "all" && (
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Plantillas de email
                  </h2>
                )}
                <EmailTemplatesSection />
              </section>
            )}
          </>
        )}
      </div>

      {addModalOpen && (
        <AddResourceModal
          onClose={() => setAddModalOpen(false)}
          onCreated={handleResourceCreated}
        />
      )}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onUpdated={handleResourceUpdated}
        />
      )}
    </div>
  )
}
