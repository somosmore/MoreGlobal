import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Lead, type LeadStatus, type LeadNote } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Trash2,
  Users,
  Download,
  MessageCircle,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  TrendingUp,
  Sparkles,
  Award,
  CalendarDays,
  ExternalLink,
  CheckCheck,
  Bell,
  StickyNote,
  Send,
  Clock4,
} from "lucide-react"

// ─── Labels ──────────────────────────────────────────────────────────────────

const RESULT_LABELS: Record<string, string> = {
  alto_impacto: "Alto Impacto",
  unsung: "Unsung",
};

const ACADEMIC_LABELS: Record<string, string> = {
  maestria: "Maestría",
  doctorado: "Doctorado / PhD",
  grado5: "Grado + 5 años",
  otros: "En proceso / Otra formación",
};

const AREA_LABELS: Record<string, string> = {
  salud: "Salud & Medicina",
  stem: "STEM & Tecnología",
  social: "Impacto Social",
  negocios: "Negocios & Emprendimiento",
};

const ACHIEVEMENT_LABELS: Record<string, string> = {
  premios: "Premios",
  publicaciones: "Publicaciones",
  liderazgo: "Liderazgo",
  patentes: "Patentes",
  conferencias: "Conferencias",
};

const SEGMENT_LABELS: Record<string, string> = {
  listo: "Listo para aplicar",
  necesita_estructura: "Necesita estructuración",
  no_califica_aun: "No califica aún",
};

const ROUTE_LABELS: Record<string, string> = {
  unsung_program: "Programa Unsung",
  mentoria_more: "Mentoría / Academia MORE",
  abogado: "Referido a abogado",
  contenido: "Contenido educativo",
};

const VISA_BUCKET_LABELS: Record<string, string> = {
  eb1: "EB1",
  eb2: "EB2 / NIW",
  o1: "O1",
  e2: "E2",
  l1: "L1",
  otra: "Otra ruta",
};

// ─── Status pipeline ─────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string; dot: string }[] = [
  { value: "nuevo",       label: "Nuevo",       color: "bg-blue-50 text-blue-700 border-blue-200",    dot: "bg-blue-500" },
  { value: "contactado",  label: "Contactado",  color: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  { value: "en_consulta", label: "En consulta", color: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  { value: "calificado",  label: "Calificado",  color: "bg-green-50 text-green-700 border-green-200",   dot: "bg-green-500" },
  { value: "cerrado",     label: "Cerrado",     color: "bg-gray-100 text-gray-500 border-gray-200",     dot: "bg-gray-400" },
  { value: "perdido",     label: "Perdido",     color: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-500" },
];

function statusMeta(value: string) {
  return STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months !== 1 ? "es" : ""}`;
}

function waLink(lead: Lead): string {
  const num = (lead.whatsapp ?? "").replace(/\D/g, "")
  const name = encodeURIComponent(lead.nombre)
  return `https://wa.me/${num}?text=Hola%20${name},%20te%20contactamos%20desde%20MORE%20Immigration%20Consulting.`
}

type FollowupState = "overdue" | "today" | "soon" | null

function followupState(followup_at: string | null | undefined): FollowupState {
  if (!followup_at) return null
  const now = new Date()
  const fu = new Date(followup_at)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)
  if (fu < todayStart) return "overdue"
  if (fu < todayEnd) return "today"
  const diff = fu.getTime() - todayEnd.getTime()
  if (diff < 3 * 86400000) return "soon"
  return null
}

function FollowupBadge({ followup_at }: { followup_at: string | null | undefined }) {
  const state = followupState(followup_at)
  if (!state) return null
  const map = {
    overdue: { cls: "text-red-500 bg-red-50", title: "Seguimiento vencido" },
    today:   { cls: "text-yellow-600 bg-yellow-50", title: "Seguimiento hoy" },
    soon:    { cls: "text-blue-500 bg-blue-50", title: "Seguimiento próximo" },
  }
  const { cls, title } = map[state]
  return (
    <span className={`inline-flex items-center rounded-full p-1 ${cls}`} title={title}>
      <Bell className="w-3 h-3" />
    </span>
  )
}

type SortField = "created_at" | "nombre" | "result_type" | "status"
type SortDir = "asc" | "desc"

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLeads() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState("")
  const [filterResult, setFilterResult] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterSegment, setFilterSegment] = useState("")
  const [filterRoute, setFilterRoute] = useState("")

  // Sort
  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  // Detail panel
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  // Actions
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Notes
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  // Follow-up
  const [followupDate, setFollowupDate] = useState("")
  const [savingFollowup, setSavingFollowup] = useState(false)
  const [followupSaved, setFollowupSaved] = useState(false)

  const hasSupabase = supabase !== null

  async function load() {
    if (!supabase) { setLoading(false); setError("Supabase no configurado."); return }
    setLoading(true)
    const { data, error: err } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
    setLoading(false)
    if (err) { setError(err.message) } else { setLeads((data ?? []) as Lead[]) }
  }

  async function loadNotes(leadId: string) {
    if (!supabase) return
    setNotesLoading(true)
    const { data } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
    setNotesLoading(false)
    setNotes((data ?? []) as LeadNote[])
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    if (selectedLead) {
      loadNotes(selectedLead.id)
      setFollowupDate(
        selectedLead.followup_at
          ? new Date(selectedLead.followup_at).toISOString().slice(0, 10)
          : ""
      )
      setNewNote("")
      setFollowupSaved(false)
    } else {
      setNotes([])
      setFollowupDate("")
    }
  }, [selectedLead?.id])

  // ── Derived data ────────────────────────────────────────────────────────────

  const today = new Date().toDateString();

  const stats = useMemo(() => ({
    total: leads.length,
    altoImpacto: leads.filter((l) => l.result_type === "alto_impacto").length,
    unsung: leads.filter((l) => l.result_type === "unsung").length,
    hoy: leads.filter((l) => new Date(l.created_at).toDateString() === today).length,
    calificados: leads.filter((l) => l.status === "calificado").length,
  }), [leads]);

  const displayed = useMemo(() => {
    let list = [...leads];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.whatsapp ?? "").includes(q)
      );
    }
    if (filterResult) list = list.filter((l) => l.result_type === filterResult);
    if (filterStatus) list = list.filter((l) => l.status === filterStatus);
    if (filterSegment) list = list.filter((l) => (l.eligibility_segment ?? "") === filterSegment);
    if (filterRoute) list = list.filter((l) => (l.recommended_route ?? "") === filterRoute);

    list.sort((a, b) => {
      let av: string = a[sortField] ?? "";
      let bv: string = b[sortField] ?? "";
      if (sortField === "created_at") { av = a.created_at; bv = b.created_at; }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [leads, search, filterResult, filterStatus, sortField, sortDir]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-[#F37021]" />
      : <ChevronDown className="w-3 h-3 text-[#F37021]" />;
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    if (!supabase) return
    setUpdatingStatusId(id)
    const { error: err } = await supabase.from("leads").update({ status }).eq("id", id)
    setUpdatingStatusId(null)
    if (!err) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
      if (selectedLead?.id === id) setSelectedLead((prev) => prev ? { ...prev, status } : prev)
    }
  }

  async function handleDelete(id: string) {
    if (!supabase) return
    if (!window.confirm("¿Eliminar este lead?")) return
    setDeletingId(id)
    const { error: err } = await supabase.from("leads").update({ deleted_at: new Date().toISOString() }).eq("id", id)
    setDeletingId(null)
    if (!err) {
      setLeads((prev) => prev.filter((l) => l.id !== id))
      if (selectedLead?.id === id) setSelectedLead(null)
    } else {
      alert("Error al eliminar: " + err.message)
    }
  }

  async function handleAddNote() {
    if (!supabase || !selectedLead || !newNote.trim()) return
    setSavingNote(true)
    const { data, error: err } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: selectedLead.id,
        content: newNote.trim(),
        author: user?.email ?? "admin",
      })
      .select()
      .single()
    setSavingNote(false)
    if (!err && data) {
      setNotes((prev) => [data as LeadNote, ...prev])
      setNewNote("")
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!supabase) return
    setDeletingNoteId(noteId)
    await supabase.from("lead_notes").delete().eq("id", noteId)
    setDeletingNoteId(null)
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  async function handleSaveFollowup() {
    if (!supabase || !selectedLead) return
    setSavingFollowup(true)
    const followup_at = followupDate ? new Date(followupDate).toISOString() : null
    const { error: err } = await supabase
      .from("leads")
      .update({ followup_at })
      .eq("id", selectedLead.id)
    setSavingFollowup(false)
    if (!err) {
      setLeads((prev) =>
        prev.map((l) => (l.id === selectedLead.id ? { ...l, followup_at } : l))
      )
      setSelectedLead((prev) => (prev ? { ...prev, followup_at } : prev))
      setFollowupSaved(true)
      setTimeout(() => setFollowupSaved(false), 2000)
    }
  }

  async function handleClearFollowup() {
    setFollowupDate("")
    if (!supabase || !selectedLead) return
    await supabase.from("leads").update({ followup_at: null }).eq("id", selectedLead.id)
    setLeads((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? { ...l, followup_at: null } : l))
    )
    setSelectedLead((prev) => (prev ? { ...prev, followup_at: null } : prev))
  }

  function copyEmail(lead: Lead) {
    navigator.clipboard.writeText(lead.email).then(() => {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function exportCSV() {
    const rows = [
      [
        "Fecha",
        "Nombre",
        "Email",
        "WhatsApp",
        "País residencia",
        "Nacionalidad",
        "Nivel",
        "Área",
        "Logros",
        "Segmento",
        "Ruta recomendada",
        "Buckets visa",
        "Resultado",
        "Estado",
      ],
      ...displayed.map((l) => [
        new Date(l.created_at).toLocaleDateString("es-CO"),
        l.nombre,
        l.email,
        l.whatsapp ?? "",
        l.country_residence ?? "",
        l.nationality ?? "",
        ACADEMIC_LABELS[l.academic_level] ?? l.academic_level,
        AREA_LABELS[l.impact_area] ?? l.impact_area,
        l.achievements.map((a) => ACHIEVEMENT_LABELS[a] ?? a).join("; "),
        l.eligibility_segment ? SEGMENT_LABELS[l.eligibility_segment] ?? l.eligibility_segment : "",
        l.recommended_route ? ROUTE_LABELS[l.recommended_route] ?? l.recommended_route : "",
        (l.visa_buckets ?? []).map((b) => VISA_BUCKET_LABELS[b] ?? b).join(" / "),
        RESULT_LABELS[l.result_type] ?? l.result_type,
        statusMeta(l.status ?? "nuevo").label,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_more_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 sm:p-8">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#2A3A4A]">Leads</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gestiona y da seguimiento a los leads del quiz</p>
      </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total leads", value: stats.total, icon: Users, color: "text-[#2A3A4A]", bg: "bg-[#2A3A4A]/5" },
            { label: "Alto Impacto", value: stats.altoImpacto, icon: Sparkles, color: "text-[#F37021]", bg: "bg-[#F37021]/8" },
            { label: "Unsung", value: stats.unsung, icon: Award, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Hoy", value: stats.hoy, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Calificados", value: stats.calificados, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#2A3A4A] leading-none">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <Input
              placeholder="Buscar por nombre o email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm h-9"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30"
            >
              <option value="">Todos los resultados</option>
              <option value="alto_impacto">Alto Impacto</option>
              <option value="unsung">Unsung</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30"
            >
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30"
            >
              <option value="">Todos los segmentos</option>
              <option value="listo">Listo para aplicar</option>
              <option value="necesita_estructura">Necesita estructuración</option>
              <option value="no_califica_aun">No califica aún</option>
            </select>
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30"
            >
              <option value="">Todas las rutas</option>
              <option value="unsung_program">Programa Unsung</option>
              <option value="mentoria_more">Mentoría / Academia MORE</option>
              <option value="abogado">Referido a abogado</option>
              <option value="contenido">Contenido educativo</option>
            </select>
            <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 h-9" disabled={displayed.length === 0}>
              <Download className="w-4 h-4" /> CSV
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          {displayed.length} de {leads.length} leads
          {(search || filterResult || filterStatus) ? " (filtrado)" : ""}
        </p>

        {!hasSupabase && (
          <Card className="border-orange-200 bg-orange-50 mb-4">
            <CardContent className="p-4 text-sm text-orange-700">
              Supabase no configurado. Añade <code className="font-mono">VITE_SUPABASE_URL</code> y <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
            </CardContent>
          </Card>
        )}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-4">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Cargando leads…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {leads.length === 0
              ? "No hay leads aún. Cuando los usuarios completen el quiz aparecerán aquí."
              : "No hay leads que coincidan con los filtros aplicados."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 hover:text-[#2A3A4A]">
                      Fecha <SortIcon field="created_at" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort("nombre")} className="flex items-center gap-1 hover:text-[#2A3A4A]">
                      Nombre <SortIcon field="nombre" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Contacto
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Perfil
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort("result_type")} className="flex items-center gap-1 hover:text-[#2A3A4A]">
                      Resultado <SortIcon field="result_type" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-[#2A3A4A]">
                      Estado <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((lead) => {
                  const sm = statusMeta(lead.status ?? "nuevo");
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      {/* Fecha */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-gray-700 font-medium block">
                          {timeAgo(lead.created_at)}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(lead.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                        </span>
                      </td>

                      {/* Nombre */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#2A3A4A] block">{lead.nombre}</span>
                      </td>

                      {/* Contacto */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()}
                          className="text-xs text-gray-600 hover:text-[#F37021] transition-colors block truncate max-w-[180px]">
                          {lead.email}
                        </a>
                        {lead.whatsapp && (
                          <span className="text-[11px] text-gray-400">{lead.whatsapp}</span>
                        )}
                      </td>

                      {/* Perfil */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 block">
                          {ACADEMIC_LABELS[lead.academic_level] ?? lead.academic_level}
                        </span>
                        <span className="text-[11px] text-gray-400 block">
                          {AREA_LABELS[lead.impact_area] ?? lead.impact_area}
                        </span>
                        {(lead.country_residence || lead.nationality) && (
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {(lead.country_residence ?? lead.nationality) &&
                              `${lead.country_residence ?? ""}${lead.country_residence && lead.nationality ? " · " : ""}${
                                lead.nationality ?? ""
                              }`}
                          </span>
                        )}
                      </td>

                      {/* Resultado + segmento */}
                      <td className="px-4 py-3 space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            lead.result_type === "alto_impacto"
                              ? "bg-[#F37021]/10 text-[#F37021]"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {RESULT_LABELS[lead.result_type] ?? lead.result_type}
                        </span>
                        {lead.eligibility_segment && (
                          <span className="block text-[11px] text-gray-400">
                            {SEGMENT_LABELS[lead.eligibility_segment] ?? lead.eligibility_segment}
                          </span>
                        )}
                        {lead.recommended_route && (
                          <span className="block text-[11px] text-gray-400">
                            {ROUTE_LABELS[lead.recommended_route] ?? lead.recommended_route}
                          </span>
                        )}
                      </td>

                      {/* Estado — dropdown inline */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <select
                            value={lead.status ?? "nuevo"}
                            disabled={updatingStatusId === lead.id}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border appearance-none cursor-pointer pr-6 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#F37021]/30 transition-all ${sm.color} ${updatingStatusId === lead.id ? "opacity-50" : ""}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          <FollowupBadge followup_at={lead.followup_at} />
                          {lead.whatsapp && (
                            <a href={waLink(lead)} target="_blank" rel="noopener noreferrer"
                              title="Abrir WhatsApp"
                              className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50">
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => copyEmail(lead)} title="Copiar email"
                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                            {copiedId === lead.id
                              ? <CheckCheck className="w-4 h-4 text-blue-500" />
                              : <Copy className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(lead.id)} disabled={deletingId === lead.id}
                            title="Eliminar lead"
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      {/* ── Detail Sheet ──────────────────────────────────────────────────── */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => { if (!open) setSelectedLead(null) }}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] flex flex-col p-0">
          {selectedLead && (
            <>
              <SheetHeader className="px-6 py-5 pr-14 bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E]">
                <SheetTitle className="text-white">{selectedLead.nombre}</SheetTitle>
                <p className="text-xs text-white/60 mt-0.5">{timeAgo(selectedLead.created_at)}</p>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Estado */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Estado del pipeline</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(selectedLead.id, s.value)}
                      disabled={updatingStatusId === selectedLead.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        (selectedLead.status ?? "nuevo") === s.value
                          ? `${s.color} shadow-sm scale-105`
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contacto */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Contacto</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-[11px] text-gray-400 mb-0.5">Email</p>
                      <a href={`mailto:${selectedLead.email}`} className="text-sm font-medium text-[#2A3A4A] hover:text-[#F37021]">
                        {selectedLead.email}
                      </a>
                    </div>
                    <button onClick={() => copyEmail(selectedLead)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      {copiedId === selectedLead.id ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {selectedLead.whatsapp && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5">WhatsApp</p>
                        <p className="text-sm font-medium text-[#2A3A4A]">{selectedLead.whatsapp}</p>
                      </div>
                      <a href={waLink(selectedLead)} target="_blank" rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Perfil del quiz */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Perfil del quiz</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Resultado</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      selectedLead.result_type === "alto_impacto" ? "bg-[#F37021]/10 text-[#F37021]" : "bg-purple-50 text-purple-700"
                    }`}>
                      {RESULT_LABELS[selectedLead.result_type]}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Segmento</span>
                    <span className="text-xs font-medium text-[#2A3A4A]">
                      {selectedLead.eligibility_segment
                        ? SEGMENT_LABELS[selectedLead.eligibility_segment] ?? selectedLead.eligibility_segment
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Ruta recomendada</span>
                    <span className="text-xs font-medium text-[#2A3A4A]">
                      {selectedLead.recommended_route
                        ? ROUTE_LABELS[selectedLead.recommended_route] ?? selectedLead.recommended_route
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Nivel académico</span>
                    <span className="text-xs font-medium text-[#2A3A4A]">
                      {ACADEMIC_LABELS[selectedLead.academic_level] ?? selectedLead.academic_level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Área de impacto</span>
                    <span className="text-xs font-medium text-[#2A3A4A]">
                      {AREA_LABELS[selectedLead.impact_area] ?? selectedLead.impact_area}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">País y nacionalidad</span>
                    <span className="text-xs font-medium text-[#2A3A4A]">
                      {(selectedLead.country_residence ?? "") ||
                      (selectedLead.nationality ?? "")
                        ? `${selectedLead.country_residence ?? ""}${
                            selectedLead.country_residence && selectedLead.nationality ? " · " : ""
                          }${selectedLead.nationality ?? ""}`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Buckets de visa */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Posibles rutas de visa
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.visa_buckets && selectedLead.visa_buckets.length > 0 ? (
                    selectedLead.visa_buckets.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100"
                      >
                        {VISA_BUCKET_LABELS[b] ?? b}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Sin buckets registrados</span>
                  )}
                </div>
              </div>

              {/* Logros */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                  Logros ({selectedLead.achievements.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.achievements.length > 0
                    ? selectedLead.achievements.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A3A4A]/5 text-[#2A3A4A] text-xs font-medium border border-[#2A3A4A]/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F37021]" />
                          {ACHIEVEMENT_LABELS[a] ?? a}
                        </span>
                      ))
                    : <span className="text-xs text-gray-400">Ninguno registrado</span>
                  }
                </div>
              </div>

              {/* Fecha */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Registrado</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedLead.created_at).toLocaleString("es-CO", {
                    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              {/* ── Seguimiento ───────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock4 className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Próximo seguimiento
                  </p>
                </div>

                {/* Current badge */}
                {selectedLead.followup_at && (() => {
                  const state = followupState(selectedLead.followup_at)
                  const stateMap = {
                    overdue: { cls: "bg-red-50 text-red-700 border-red-200", label: "Vencido" },
                    today:   { cls: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Hoy" },
                    soon:    { cls: "bg-blue-50 text-blue-700 border-blue-200", label: "Próximo" },
                  }
                  const meta = state ? stateMap[state] : { cls: "bg-gray-50 text-gray-600 border-gray-200", label: "Programado" }
                  return (
                    <div className={`flex items-center justify-between px-3 py-2 rounded-xl border mb-3 ${meta.cls}`}>
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{meta.label}</span>
                        <span className="text-xs">
                          {new Date(selectedLead.followup_at).toLocaleDateString("es-CO", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>
                      <button
                        onClick={handleClearFollowup}
                        className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
                        title="Quitar recordatorio"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                })()}

                <div className="flex gap-2">
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30 bg-white text-gray-700"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSaveFollowup}
                    disabled={savingFollowup || !followupDate}
                    className="shrink-0 gap-1.5"
                  >
                    {followupSaved ? (
                      <CheckCheck className="w-4 h-4 text-green-500" />
                    ) : savingFollowup ? (
                      <span className="text-xs">...</span>
                    ) : (
                      <span className="text-xs">Guardar</span>
                    )}
                  </Button>
                </div>
              </div>

              {/* ── Notas ─────────────────────────────────────────────── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Notas {notes.length > 0 && `(${notes.length})`}
                  </p>
                </div>

                {/* New note input */}
                <div className="flex gap-2 mb-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote()
                    }}
                    placeholder="Escribe una nota… (Ctrl+Enter para guardar)"
                    rows={2}
                    className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#F37021]/30 bg-white text-gray-700 placeholder:text-gray-300"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={savingNote || !newNote.trim()}
                    className="p-2 self-end rounded-xl bg-[#2A3A4A] text-white hover:bg-[#3A4D5E] disabled:opacity-40 transition-colors"
                    title="Agregar nota"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Notes list */}
                {notesLoading ? (
                  <p className="text-xs text-gray-400 text-center py-2">Cargando notas…</p>
                ) : notes.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">
                    Sin notas aún. Registra el resultado de cada contacto.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((note) => (
                      <li key={note.id} className="group relative bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pr-6">
                          {note.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-gray-400">{note.author}</span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-400">{timeAgo(note.created_at)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={deletingNoteId === note.id}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                          title="Eliminar nota"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

              <SheetFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-start">
                {selectedLead.whatsapp && (
                  <Button variant="gold" className="flex-1 gap-2" asChild>
                    <a href={waLink(selectedLead)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="flex-1 gap-2" asChild>
                  <a href={`mailto:${selectedLead.email}`}>
                    <ExternalLink className="w-4 h-4" />
                    Email
                  </a>
                </Button>
                <button
                  onClick={() => handleDelete(selectedLead.id)}
                  disabled={deletingId === selectedLead.id}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
