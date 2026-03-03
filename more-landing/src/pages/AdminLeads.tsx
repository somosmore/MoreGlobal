import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Lead, type LeadStatus } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Trash2,
  Users,
  FileText,
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
} from "lucide-react";

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
  const num = (lead.whatsapp ?? "").replace(/\D/g, "");
  const name = encodeURIComponent(lead.nombre);
  return `https://wa.me/${num}?text=Hola%20${name},%20te%20contactamos%20desde%20MORE%20Immigration%20Consulting.`;
}

type SortField = "created_at" | "nombre" | "result_type" | "status";
type SortDir = "asc" | "desc";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLeads() {
  const { signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterResult, setFilterResult] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Sort
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Detail panel
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Actions
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasSupabase = supabase !== null;

  async function load() {
    if (!supabase) { setLoading(false); setError("Supabase no configurado."); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (err) { setError(err.message); } else { setLeads((data ?? []) as Lead[]); }
  }

  useEffect(() => { load(); }, []);

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
    if (!supabase) return;
    setUpdatingStatusId(id);
    const { error: err } = await supabase.from("leads").update({ status }).eq("id", id);
    setUpdatingStatusId(null);
    if (!err) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selectedLead?.id === id) setSelectedLead((prev) => prev ? { ...prev, status } : prev);
    }
  }

  async function handleDelete(id: string) {
    if (!supabase) return;
    if (!window.confirm("¿Eliminar este lead?")) return;
    setDeletingId(id);
    const { error: err } = await supabase.from("leads").delete().eq("id", id);
    setDeletingId(null);
    if (!err) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    } else {
      alert("Error al eliminar: " + err.message);
    }
  }

  function copyEmail(lead: Lead) {
    navigator.clipboard.writeText(lead.email).then(() => {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }

  function exportCSV() {
    const rows = [
      ["Fecha", "Nombre", "Email", "WhatsApp", "Nivel", "Área", "Logros", "Resultado", "Estado"],
      ...displayed.map((l) => [
        new Date(l.created_at).toLocaleDateString("es-CO"),
        l.nombre, l.email, l.whatsapp ?? "",
        ACADEMIC_LABELS[l.academic_level] ?? l.academic_level,
        AREA_LABELS[l.impact_area] ?? l.impact_area,
        l.achievements.map((a) => ACHIEVEMENT_LABELS[a] ?? a).join("; "),
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo_more_light.png" alt="MORE" className="h-8 w-auto" />
            <span className="text-sm font-semibold text-gray-700 hidden sm:block">Panel Admin</span>
          </div>
          <nav className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-white hover:text-[#2A3A4A] transition-all">
              <FileText className="w-3.5 h-3.5" /> Testimonios
            </Link>
            <Link to="/admin/leads" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-white text-[#2A3A4A] shadow-sm">
              <Users className="w-3.5 h-3.5" /> Leads
            </Link>
          </nav>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2 text-gray-500">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
            <select value={filterResult} onChange={(e) => setFilterResult(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30">
              <option value="">Todos los resultados</option>
              <option value="alto_impacto">Alto Impacto</option>
              <option value="unsung">Unsung</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F37021]/30">
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
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
                        <span className="text-[11px] text-gray-400">
                          {AREA_LABELS[lead.impact_area] ?? lead.impact_area}
                        </span>
                      </td>

                      {/* Resultado */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          lead.result_type === "alto_impacto"
                            ? "bg-[#F37021]/10 text-[#F37021]"
                            : "bg-purple-50 text-purple-700"
                        }`}>
                          {RESULT_LABELS[lead.result_type] ?? lead.result_type}
                        </span>
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
      </main>

      {/* Detail Panel */}
      {selectedLead && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[2px]"
            onClick={() => setSelectedLead(null)}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E]">
              <div>
                <h2 className="text-base font-bold text-white">{selectedLead.nombre}</h2>
                <p className="text-xs text-white/60 mt-0.5">{timeAgo(selectedLead.created_at)}</p>
              </div>
              <button onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

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
            </div>

            {/* Panel footer actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
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
              <button onClick={() => handleDelete(selectedLead.id)}
                disabled={deletingId === selectedLead.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
