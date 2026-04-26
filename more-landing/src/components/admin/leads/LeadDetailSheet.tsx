import type { Lead, LeadStatus, LeadNote } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter,
} from "@/components/ui/sheet"
import {
  Trash2, MessageCircle, Copy, X, ExternalLink,
  CheckCheck, Bell, StickyNote, Send, Clock4,
} from "lucide-react"
import { timeAgo, waLink, followupState } from "./helpers"
import {
  RESULT_LABELS, ACADEMIC_LABELS, AREA_LABELS, ACHIEVEMENT_LABELS,
  SEGMENT_LABELS, ROUTE_LABELS, VISA_BUCKET_LABELS, STATUS_OPTIONS,
} from "./constants"

type Props = {
  selectedLead: Lead | null
  setSelectedLead: (lead: Lead | null) => void
  updatingStatusId: string | null
  handleStatusChange: (id: string, status: LeadStatus) => void
  copiedId: string | null
  copyEmail: (lead: Lead) => void
  deletingId: string | null
  handleDelete: (id: string) => void
  notes: LeadNote[]
  notesLoading: boolean
  newNote: string
  setNewNote: (v: string) => void
  savingNote: boolean
  deletingNoteId: string | null
  handleAddNote: () => void
  handleDeleteNote: (noteId: string) => void
  followupDate: string
  setFollowupDate: (v: string) => void
  savingFollowup: boolean
  followupSaved: boolean
  handleSaveFollowup: () => void
  handleClearFollowup: () => void
}

export default function LeadDetailSheet({
  selectedLead, setSelectedLead,
  updatingStatusId, handleStatusChange,
  copiedId, copyEmail, deletingId, handleDelete,
  notes, notesLoading, newNote, setNewNote, savingNote, deletingNoteId,
  handleAddNote, handleDeleteNote,
  followupDate, setFollowupDate, savingFollowup, followupSaved,
  handleSaveFollowup, handleClearFollowup,
}: Props) {
  return (
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
                  {([
                    ["Resultado", (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        selectedLead.result_type === "alto_impacto" ? "bg-[#F37021]/10 text-[#F37021]" : "bg-purple-50 text-purple-700"
                      }`}>
                        {RESULT_LABELS[selectedLead.result_type]}
                      </span>
                    )],
                    ["Segmento", selectedLead.eligibility_segment
                      ? SEGMENT_LABELS[selectedLead.eligibility_segment] ?? selectedLead.eligibility_segment
                      : "—"],
                    ["Ruta recomendada", selectedLead.recommended_route
                      ? ROUTE_LABELS[selectedLead.recommended_route] ?? selectedLead.recommended_route
                      : "—"],
                    ["Nivel académico", ACADEMIC_LABELS[selectedLead.academic_level] ?? selectedLead.academic_level],
                    ["Área de impacto", AREA_LABELS[selectedLead.impact_area] ?? selectedLead.impact_area],
                    ["País y nacionalidad", (selectedLead.country_residence || selectedLead.nationality)
                      ? `${selectedLead.country_residence ?? ""}${selectedLead.country_residence && selectedLead.nationality ? " · " : ""}${selectedLead.nationality ?? ""}`
                      : "—"],
                  ] as [string, React.ReactNode][]).map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500">{label}</span>
                      {typeof value === "string"
                        ? <span className="text-xs font-medium text-[#2A3A4A]">{value}</span>
                        : value}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buckets de visa */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Posibles rutas de visa</p>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.visa_buckets && selectedLead.visa_buckets.length > 0 ? (
                    selectedLead.visa_buckets.map((b) => (
                      <span key={b} className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
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

              {/* Seguimiento */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock4 className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Próximo seguimiento</p>
                </div>

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
                      <button onClick={handleClearFollowup}
                        className="p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity" title="Quitar recordatorio">
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
                  <Button size="sm" variant="outline" onClick={handleSaveFollowup}
                    disabled={savingFollowup || !followupDate} className="shrink-0 gap-1.5">
                    {followupSaved ? <CheckCheck className="w-4 h-4 text-green-500" />
                      : savingFollowup ? <span className="text-xs">...</span>
                      : <span className="text-xs">Guardar</span>}
                  </Button>
                </div>
              </div>

              {/* Notas */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <StickyNote className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Notas {notes.length > 0 && `(${notes.length})`}
                  </p>
                </div>

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
                  <button onClick={handleAddNote} disabled={savingNote || !newNote.trim()}
                    className="p-2 self-end rounded-xl bg-[#2A3A4A] text-white hover:bg-[#3A4D5E] disabled:opacity-40 transition-colors" title="Agregar nota">
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {notesLoading ? (
                  <p className="text-xs text-gray-400 text-center py-2">Cargando notas…</p>
                ) : notes.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-3">Sin notas aún. Registra el resultado de cada contacto.</p>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((note) => (
                      <li key={note.id} className="group relative bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pr-6">{note.content}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-gray-400">{note.author}</span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[10px] text-gray-400">{timeAgo(note.created_at)}</span>
                        </div>
                        <button onClick={() => handleDeleteNote(note.id)} disabled={deletingNoteId === note.id}
                          className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50" title="Eliminar nota">
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
              <button onClick={() => handleDelete(selectedLead.id)} disabled={deletingId === selectedLead.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
