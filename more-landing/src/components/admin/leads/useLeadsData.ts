import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Lead, type LeadStatus, type LeadNote } from "@/lib/supabase"
import type { SortField, SortDir } from "./helpers"
import {
  ACADEMIC_LABELS,
  AREA_LABELS,
  ACHIEVEMENT_LABELS,
  SEGMENT_LABELS,
  ROUTE_LABELS,
  VISA_BUCKET_LABELS,
  statusMeta,
} from "./constants"

export function useLeadsData() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [filterResult, setFilterResult] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterSegment, setFilterSegment] = useState("")
  const [filterRoute, setFilterRoute] = useState("")

  const [sortField, setSortField] = useState<SortField>("created_at")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [notes, setNotes] = useState<LeadNote[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

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

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (selectedLead) {
        void loadNotes(selectedLead.id)
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
    }, 0)
    return () => window.clearTimeout(timer)
  }, [selectedLead])

  const today = new Date().toDateString()

  const stats = useMemo(() => ({
    total: leads.length,
    altoImpacto: leads.filter((l) => l.result_type === "alto_impacto").length,
    unsung: leads.filter((l) => l.result_type === "unsung").length,
    hoy: leads.filter((l) => new Date(l.created_at).toDateString() === today).length,
    calificados: leads.filter((l) => l.status === "calificado").length,
  }), [leads, today])

  const displayed = useMemo(() => {
    let list = [...leads]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.whatsapp ?? "").includes(q)
      )
    }
    if (filterResult) list = list.filter((l) => l.result_type === filterResult)
    if (filterStatus) list = list.filter((l) => l.status === filterStatus)
    if (filterSegment) list = list.filter((l) => (l.eligibility_segment ?? "") === filterSegment)
    if (filterRoute) list = list.filter((l) => (l.recommended_route ?? "") === filterRoute)

    list.sort((a, b) => {
      let av: string = a[sortField] ?? ""
      let bv: string = b[sortField] ?? ""
      if (sortField === "created_at") { av = a.created_at; bv = b.created_at }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [leads, search, filterResult, filterStatus, filterSegment, filterRoute, sortField, sortDir])

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("desc")
    }
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
      setCopiedId(lead.id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }

  function exportCSV() {
    const rows = [
      [
        "Fecha", "Nombre", "Email", "WhatsApp", "País residencia", "Nacionalidad",
        "Nivel", "Área", "Logros", "Segmento", "Ruta recomendada", "Buckets visa",
        "Resultado", "Estado",
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
        statusMeta(l.status ?? "nuevo").label,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads_more_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    leads, loading, error, hasSupabase,
    search, setSearch, filterResult, setFilterResult, filterStatus, setFilterStatus,
    filterSegment, setFilterSegment, filterRoute, setFilterRoute,
    sortField, sortDir, toggleSort,
    displayed, stats,
    selectedLead, setSelectedLead,
    deletingId, updatingStatusId, copiedId,
    notes, notesLoading, newNote, setNewNote, savingNote, deletingNoteId,
    followupDate, setFollowupDate, savingFollowup, followupSaved,
    handleStatusChange, handleDelete, handleAddNote, handleDeleteNote,
    handleSaveFollowup, handleClearFollowup, copyEmail, exportCSV,
  }
}
