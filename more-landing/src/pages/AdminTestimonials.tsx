import { useState, useEffect } from "react"
import {
  supabase,
  CATEGORY_LABELS,
  type Testimonial,
  type TestimonialInsert,
} from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Video, FileText } from "lucide-react"

const CATEGORY_OPTIONS = [
  "abogados_in_house",
  "abogados_preparadora_monica_martinez",
  "aprobados_abogada_marcela_rodriguez",
  "en_espera_aprobacion",
] as const;

const MEDIA_OPTIONS = [
  { value: "text_photo", label: "Texto + foto" },
  { value: "video", label: "Video" },
] as const;

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
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<TestimonialInsert>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSupabase = supabase !== null;

  async function load() {
    if (!supabase) {
      setLoading(false);
      setError("Supabase no configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env");
      return;
    }
    setLoading(true);
    setError(null);
    const q = supabase
      .from("testimonials")
      .select("*")
      .order("category")
      .order("sort_order")
      .order("id");
    const { data, error: e } = await q;
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    setTestimonials((data as Testimonial[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered =
    categoryFilter === ""
      ? testimonials
      : testimonials.filter((t) => t.category === categoryFilter);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditingId(t.id);
    setFormOpen(true);
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
    });
  }

  function closeForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(false);
  }

  function updateField<K extends keyof TestimonialInsert>(
    key: K,
    value: TestimonialInsert[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const isVideo = form.media_type === "video";
    if (isVideo && !form.video_url?.trim()) {
      setError("El enlace del video es obligatorio para testimonios en video.");
      return;
    }
    setSaving(true);
    setError(null);
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
    };
    if (editingId) {
      const { error: err } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", editingId);
      if (err) setError(err.message);
      else {
        closeForm();
        load();
      }
    } else {
      const { error: err } = await supabase.from("testimonials").insert(payload);
      if (err) setError(err.message);
      else {
        closeForm();
        load();
      }
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    if (!supabase) return;
    const { error: err } = await supabase.from("testimonials").delete().eq("id", id);
    if (err) setError(err.message);
    else load();
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2A3A4A]">Testimonios</h1>
        <p className="text-sm text-gray-400 mt-0.5">Administra los testimonios que se muestran en el sitio</p>
      </div>
        {!hasSupabase && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
            Supabase no está configurado. Crea un archivo <code className="bg-amber-100 px-1 rounded">.env</code> en la raíz de <code className="bg-amber-100 px-1 rounded">more-landing</code> con <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> y <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> (ver <code className="bg-amber-100 px-1 rounded">.env.example</code>).
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Filtrar por categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white min-w-[200px]"
            >
              <option value="">Todas las categorías</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={openCreate} variant="gold" size="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo testimonio
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {formOpen && (
          <Card className="mb-8 border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-[#2A3A4A] px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  {editingId ? "Editar testimonio" : "Nuevo testimonio"}
                </h2>
                <p className="text-white/70 text-sm mt-0.5">
                  {form.media_type === "video"
                    ? "Solo necesitas el enlace del video. Se mostrará en la sección «Testimonios en video»."
                    : "Completa los datos del testimonio con texto y opcionalmente una foto."}
                </p>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* 1. Tipo de medio (siempre primero) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de medio
                  </label>
                  <div className="flex gap-3">
                    {MEDIA_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() =>
                          updateField("media_type", o.value as "text_photo" | "video")
                        }
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                          form.media_type === o.value
                            ? "border-[#F37021] bg-[#F37021]/10 text-[#2A3A4A]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {o.value === "video" ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video: solo enlace, categoría y orden */}
                {form.media_type === "video" && (
                  <div className="space-y-4 rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enlace del video *
                      </label>
                      <Input
                        value={form.video_url ?? ""}
                        onChange={(e) =>
                          updateField("video_url", e.target.value || null)
                        }
                        placeholder="YouTube, Vimeo o Google Drive (https://...)"
                        className="font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            updateField("category", e.target.value as Testimonial["category"])
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full bg-white"
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Orden
                        </label>
                        <Input
                          type="number"
                          value={form.sort_order ?? 0}
                          onChange={(e) =>
                            updateField("sort_order", parseInt(e.target.value, 10) || 0)
                          }
                          className="bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Texto + foto: resto de campos */}
                {form.media_type === "text_photo" && (
                  <>
                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">
                        Datos de la persona
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre *
                          </label>
                          <Input
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            required={form.media_type === "text_photo"}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            País
                          </label>
                          <Input
                            value={form.country ?? ""}
                            onChange={(e) =>
                              updateField("country", e.target.value || null)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rol / profesión
                          </label>
                          <Input
                            value={form.role ?? ""}
                            onChange={(e) =>
                              updateField("role", e.target.value || null)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Área
                          </label>
                          <Input
                            value={form.area ?? ""}
                            onChange={(e) =>
                              updateField("area", e.target.value || null)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Programa
                        </label>
                        <Input
                          value={form.program ?? ""}
                          onChange={(e) =>
                            updateField("program", e.target.value || null)
                          }
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Timeline
                        </label>
                        <Input
                          value={form.timeline ?? ""}
                          onChange={(e) =>
                            updateField("timeline", e.target.value || null)
                          }
                          placeholder="87 días, Aprobado en 120 días"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Etiqueta status
                        </label>
                        <Input
                          value={form.status_label ?? ""}
                          onChange={(e) =>
                            updateField("status_label", e.target.value || null)
                          }
                          placeholder="APROBADO INHOUSE, En espera de aprobación"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL foto
                      </label>
                      <Input
                        value={form.photo_url ?? ""}
                        onChange={(e) =>
                          updateField("photo_url", e.target.value || null)
                        }
                        placeholder="https://... (opcional)"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <select
                          value={form.category}
                          onChange={(e) =>
                            updateField("category", e.target.value as Testimonial["category"])
                          }
                          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-full"
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Orden
                        </label>
                        <Input
                          type="number"
                          value={form.sort_order ?? 0}
                          onChange={(e) =>
                            updateField("sort_order", parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Guardando…" : "Guardar"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">Cargando testimonios…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-white border border-gray-100 p-6">
            <p className="text-gray-500">
              No hay testimonios{categoryFilter ? " en esta categoría" : ""}.
            </p>
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
          <ul className="space-y-3">
            {filtered.map((t) => (
              <li key={t.id}>
                <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span
                        className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${
                          t.media_type === "video"
                            ? "bg-[#F37021]/10 text-[#F37021]"
                            : "bg-[#2A3A4A]/10 text-[#2A3A4A]"
                        }`}
                        title={t.media_type === "video" ? "Video" : "Texto + foto"}
                      >
                        {t.media_type === "video" ? (
                          <Video className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold text-[#2A3A4A] block truncate">
                          {t.media_type === "video"
                            ? (t.video_url ? "Video testimonio" : "Video")
                            : t.name}
                        </span>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-sm text-gray-500">
                          {t.media_type === "text_photo" && t.country && (
                            <span>{t.country}</span>
                          )}
                          <span className="text-gray-400">
                            {CATEGORY_LABELS[t.category]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(t)}
                        aria-label="Editar"
                        className="text-gray-600 hover:text-[#2A3A4A]"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id)}
                        aria-label="Eliminar"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
