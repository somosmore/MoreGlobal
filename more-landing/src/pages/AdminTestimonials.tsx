import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  supabase,
  CATEGORY_LABELS,
  type Testimonial,
  type TestimonialInsert,
} from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  FileText,
  GripVertical,
  MapPin,
  Briefcase,
  Clock,
  Tag,
  Globe,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  "abogados_in_house",
  "abogados_preparadora_monica_martinez",
  "aprobados_abogada_marcela_rodriguez",
  "en_espera_aprobacion",
] as const

const MEDIA_OPTIONS = [
  { value: "text_photo", label: "Texto + foto" },
  { value: "video", label: "Video" },
] as const

const emptyForm: TestimonialInsert = {
  name: "",
  country: null,
  role: null,
  area: null,
  program: null,
  quote: "",
  timeline: null,
  status_label: null,
  media_type: "text_photo",
  photo_url: null,
  video_url: null,
  category: "en_espera_aprobacion",
  sort_order: 0,
}

// ─── Category badge colors ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<Testimonial["category"], string> = {
  abogados_in_house:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  abogados_preparadora_monica_martinez:
    "bg-blue-50 text-blue-700 border-blue-200",
  aprobados_abogada_marcela_rodriguez:
    "bg-violet-50 text-violet-700 border-violet-200",
  en_espera_aprobacion:
    "bg-amber-50 text-amber-700 border-amber-200",
}

// ─── Sortable card ────────────────────────────────────────────────────────────

function SortableCard({
  testimonial,
  onEdit,
  onDelete,
}: {
  testimonial: Testimonial
  onEdit: (t: Testimonial) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: testimonial.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  const t = testimonial
  const isVideo = t.media_type === "video"

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`border transition-all duration-150 ${
          isDragging
            ? "border-[#F37021] shadow-xl bg-orange-50/30"
            : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
        }`}
      >
        <CardContent className="p-0">
          <div className="flex gap-0">
            {/* ── Drag handle ── */}
            <button
              {...attributes}
              {...listeners}
              className="flex items-center justify-center w-10 shrink-0 rounded-l-xl text-gray-300 hover:text-gray-500 hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors border-r border-gray-100"
              aria-label="Arrastrar para reordenar"
              title="Arrastrar para reordenar"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* ── Card body ── */}
            <div className="flex flex-1 gap-4 p-4 min-w-0">

              {/* Avatar / Photo */}
              <div className="shrink-0">
                {isVideo ? (
                  <div className="w-16 h-16 rounded-xl bg-[#F37021]/10 flex items-center justify-center border border-[#F37021]/20">
                    <Video className="w-7 h-7 text-[#F37021]" />
                  </div>
                ) : t.photo_url ? (
                  <img
                    src={t.photo_url}
                    alt={t.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#2A3A4A]/10 flex items-center justify-center border border-[#2A3A4A]/10">
                    <span className="text-xl font-bold text-[#2A3A4A]/40">
                      {t.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-2">

                {/* Row 1: name + badges */}
                <div className="flex flex-wrap items-start gap-2">
                  <span className="font-bold text-[#2A3A4A] text-base leading-tight">
                    {isVideo
                      ? (t.video_url ? "Video testimonio" : "Video")
                      : t.name}
                  </span>
                  {/* Category badge */}
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[t.category]}`}
                  >
                    {CATEGORY_LABELS[t.category]}
                  </span>
                  {/* Status label */}
                  {!isVideo && t.status_label && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      {t.status_label}
                    </span>
                  )}
                </div>

                {/* Row 2: metadata chips */}
                {!isVideo && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    {t.country && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {t.country}
                      </span>
                    )}
                    {t.role && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-gray-400" />
                        {t.role}
                      </span>
                    )}
                    {t.area && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-gray-400" />
                        {t.area}
                      </span>
                    )}
                    {t.program && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        {t.program}
                      </span>
                    )}
                    {t.timeline && (
                      <span className="flex items-center gap-1 font-semibold text-[#F37021]">
                        <Clock className="w-3 h-3" />
                        {t.timeline}
                      </span>
                    )}
                  </div>
                )}

                {/* Row 3: quote / video URL */}
                {isVideo ? (
                  t.video_url && (
                    <a
                      href={t.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#F37021] hover:underline truncate max-w-full"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{t.video_url}</span>
                    </a>
                  )
                ) : (
                  t.quote && t.quote !== "—" && (
                    <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-2">
                      "{t.quote}"
                    </p>
                  )
                )}
              </div>

              {/* Sort order + actions */}
              <div className="shrink-0 flex flex-col items-end justify-between gap-2 pl-2">
                {/* Order badge */}
                <span
                  className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500"
                  title="Orden"
                >
                  {t.sort_order}
                </span>
                {/* Action buttons */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(t)}
                    aria-label="Editar"
                    className="w-8 h-8 text-gray-500 hover:text-[#2A3A4A] hover:bg-gray-100"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(t.id)}
                    aria-label="Eliminar"
                    className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<TestimonialInsert>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSupabase = supabase !== null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // ── Data ──────────────────────────────────────────────────────────────────

  const load = async () => {
    if (!supabase) {
      setLoading(false)
      setError("Supabase no configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env")
      return
    }
    setLoading(true)
    setError(null)
    const { data, error: e } = await supabase
      .from("testimonials")
      .select("*")
      .order("category")
      .order("sort_order")
      .order("id")
    setLoading(false)
    if (e) { setError(e.message); return }
    setTestimonials((data as Testimonial[]) ?? [])
  }

  useEffect(() => { load() }, [])

  const filtered =
    categoryFilter === ""
      ? testimonials
      : testimonials.filter((t) => t.category === categoryFilter)

  // ── Drag & Drop ──────────────────────────────────────────────────────────

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeIndex = filtered.findIndex((t) => t.id === active.id)
    const overIndex = filtered.findIndex((t) => t.id === over.id)
    if (activeIndex === -1 || overIndex === -1) return

    const reordered = arrayMove(filtered, activeIndex, overIndex)

    setTestimonials((prev) => {
      const filteredIds = new Set(filtered.map((t) => t.id))
      const rest = prev.filter((t) => !filteredIds.has(t.id))
      const updated = reordered.map((t, i) => ({ ...t, sort_order: i }))
      return [...rest, ...updated].sort(
        (a, b) =>
          a.category.localeCompare(b.category) ||
          a.sort_order - b.sort_order
      )
    })

    if (!supabase) return

    setReordering(true)
    const updates = reordered.map((t, i) =>
      supabase!
        .from("testimonials")
        .update({ sort_order: i })
        .eq("id", t.id)
    )
    await Promise.all(updates)
    setReordering(false)
  }

  // ── Form helpers ──────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({
      name: t.name,
      country: t.country ?? null,
      role: t.role ?? null,
      area: t.area ?? null,
      program: t.program ?? null,
      quote: t.quote,
      timeline: t.timeline ?? null,
      status_label: t.status_label ?? null,
      media_type: t.media_type,
      photo_url: t.photo_url ?? null,
      video_url: t.video_url ?? null,
      category: t.category,
      sort_order: t.sort_order,
    })
    setFormOpen(true)
  }

  const closeForm = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(false)
  }

  const updateField = <K extends keyof TestimonialInsert>(
    key: K,
    value: TestimonialInsert[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    const isVideo = form.media_type === "video"
    if (isVideo && !form.video_url?.trim()) {
      setError("El enlace del video es obligatorio para testimonios en video.")
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      ...form,
      name: isVideo ? "Video" : (form.name.trim() || ""),
      quote: isVideo ? "—" : (form.quote.trim() || ""),
      country: isVideo ? null : (form.country?.trim() || null),
      role: isVideo ? null : (form.role?.trim() || null),
      area: isVideo ? null : (form.area?.trim() || null),
      program: isVideo ? null : (form.program?.trim() || null),
      timeline: isVideo ? null : (form.timeline?.trim() || null),
      status_label: isVideo ? null : (form.status_label?.trim() || null),
      photo_url: isVideo ? null : (form.photo_url?.trim() || null),
      video_url: form.video_url?.trim() || null,
      sort_order: form.sort_order ?? 0,
    }
    if (editingId) {
      const { error: err } = await supabase.from("testimonials").update(payload).eq("id", editingId)
      if (err) setError(err.message)
      else { closeForm(); load() }
    } else {
      const { error: err } = await supabase.from("testimonials").insert(payload)
      if (err) setError(err.message)
      else { closeForm(); load() }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este testimonio?")) return
    if (!supabase) return
    const { error: err } = await supabase.from("testimonials").delete().eq("id", id)
    if (err) setError(err.message)
    else load()
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2A3A4A]">Testimonios</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Administra los testimonios del sitio. Arrastra para reordenar dentro de cada categoría.
        </p>
      </div>

      {/* Supabase warning */}
      {!hasSupabase && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          Supabase no está configurado. Crea un archivo{" "}
          <code className="bg-amber-100 px-1 rounded">.env</code> con{" "}
          <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> y{" "}
          <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>.
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filtrar por categoría</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white min-w-[200px]"
          >
            <option value="">Todas las categorías</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
            ))}
          </select>
          {reordering && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Guardando orden…
            </span>
          )}
        </div>
        <Button onClick={openCreate} variant="gold" size="default" className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo testimonio
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cargando testimonios…
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-white border border-gray-100 p-6">
          <p className="text-gray-500">No hay testimonios{categoryFilter ? " en esta categoría" : ""}.</p>
          {categoryFilter && (
            <button
              type="button"
              onClick={() => setCategoryFilter("")}
              className="mt-2 text-sm text-[#F37021] hover:underline"
            >
              Ver todos
            </button>
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {filtered.map((t) => (
                <SortableCard
                  key={t.id}
                  testimonial={t}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ── Edit / Create Sheet ───────────────────────────────────────────── */}
      <Sheet open={formOpen} onOpenChange={(open) => { if (!open) closeForm() }}>
        <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0">
          <SheetHeader className="pr-12">
            <SheetTitle>
              {editingId ? "Editar testimonio" : "Nuevo testimonio"}
            </SheetTitle>
            <SheetDescription>
              {form.media_type === "video"
                ? "Solo necesitas el enlace del video."
                : "Completa los datos del testimonio."}
            </SheetDescription>
          </SheetHeader>

          <form
            id="testimonial-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
          >
            {/* Media type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de medio
              </label>
              <div className="flex gap-3">
                {MEDIA_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => updateField("media_type", o.value as "text_photo" | "video")}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      form.media_type === o.value
                        ? "border-[#F37021] bg-[#F37021]/10 text-[#2A3A4A]"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {o.value === "video" ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video fields */}
            {form.media_type === "video" && (
              <div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlace del video *
                  </label>
                  <Input
                    value={form.video_url ?? ""}
                    onChange={(e) => updateField("video_url", e.target.value || null)}
                    placeholder="YouTube, Vimeo o Google Drive (https://...)"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value as Testimonial["category"])}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full bg-white"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                    <Input
                      type="number"
                      value={form.sort_order ?? 0}
                      onChange={(e) => updateField("sort_order", parseInt(e.target.value, 10) || 0)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Text+photo fields */}
            {form.media_type === "text_photo" && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Datos de la persona</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                      <Input
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        required={form.media_type === "text_photo"}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                      <Input
                        value={form.country ?? ""}
                        onChange={(e) => updateField("country", e.target.value || null)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol / profesión</label>
                      <Input
                        value={form.role ?? ""}
                        onChange={(e) => updateField("role", e.target.value || null)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                      <Input
                        value={form.area ?? ""}
                        onChange={(e) => updateField("area", e.target.value || null)}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Programa</label>
                    <Input
                      value={form.program ?? ""}
                      onChange={(e) => updateField("program", e.target.value || null)}
                      placeholder="UPP, Plan Acelerador, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonio (cita) *
                  </label>
                  <textarea
                    value={form.quote}
                    onChange={(e) => updateField("quote", e.target.value)}
                    required={form.media_type === "text_photo"}
                    rows={4}
                    className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3A4A]/20"
                    placeholder="Texto del testimonio..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <Input
                      value={form.timeline ?? ""}
                      onChange={(e) => updateField("timeline", e.target.value || null)}
                      placeholder="87 días, Aprobado en 120 días"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta status</label>
                    <Input
                      value={form.status_label ?? ""}
                      onChange={(e) => updateField("status_label", e.target.value || null)}
                      placeholder="APROBADO INHOUSE, En espera de aprobación"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL foto</label>
                  <Input
                    value={form.photo_url ?? ""}
                    onChange={(e) => updateField("photo_url", e.target.value || null)}
                    placeholder="https://... (opcional)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value as Testimonial["category"])}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                    <Input
                      type="number"
                      value={form.sort_order ?? 0}
                      onChange={(e) => updateField("sort_order", parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                </div>
              </>
            )}
          </form>

          <SheetFooter>
            <Button type="submit" form="testimonial-form" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando…
                </>
              ) : (
                editingId ? "Guardar cambios" : "Crear testimonio"
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              Cancelar
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
