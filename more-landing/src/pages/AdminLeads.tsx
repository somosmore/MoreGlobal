import { Card, CardContent } from "@/components/ui/card"
import { useLeadsData } from "@/components/admin/leads/useLeadsData"
import LeadsKpiCards from "@/components/admin/leads/LeadsKpiCards"
import LeadsToolbar from "@/components/admin/leads/LeadsToolbar"
import LeadsTable from "@/components/admin/leads/LeadsTable"
import LeadDetailSheet from "@/components/admin/leads/LeadDetailSheet"

export default function AdminLeads() {
  const data = useLeadsData()

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Leads</h1>
        <p className="text-sm text-gray-400 mt-0.5">Gestiona y da seguimiento a los leads del quiz</p>
      </div>

      <LeadsKpiCards stats={data.stats} />

      <LeadsToolbar
        search={data.search} setSearch={data.setSearch}
        filterResult={data.filterResult} setFilterResult={data.setFilterResult}
        filterStatus={data.filterStatus} setFilterStatus={data.setFilterStatus}
        filterSegment={data.filterSegment} setFilterSegment={data.setFilterSegment}
        filterRoute={data.filterRoute} setFilterRoute={data.setFilterRoute}
        exportCSV={data.exportCSV}
        displayedCount={data.displayed.length}
      />

      <p className="text-xs text-gray-400 mb-4">
        {data.displayed.length} de {data.leads.length} leads
        {(data.search || data.filterResult || data.filterStatus) ? " (filtrado)" : ""}
      </p>

      {!data.hasSupabase && (
        <Card className="border-orange-200 bg-orange-50 mb-4">
          <CardContent className="p-4 text-sm text-orange-700">
            Supabase no configurado. Añade <code className="font-mono">VITE_SUPABASE_URL</code> y <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
          </CardContent>
        </Card>
      )}
      {data.error && (
        <Card className="border-red-200 bg-red-50 mb-4">
          <CardContent className="p-4 text-sm text-red-700">{data.error}</CardContent>
        </Card>
      )}

      {data.loading ? (
        <div className="text-center py-16 text-gray-400">Cargando leads…</div>
      ) : data.displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {data.leads.length === 0
            ? "No hay leads aún. Cuando los usuarios completen el quiz aparecerán aquí."
            : "No hay leads que coincidan con los filtros aplicados."}
        </div>
      ) : (
        <LeadsTable
          displayed={data.displayed}
          sortField={data.sortField} sortDir={data.sortDir} toggleSort={data.toggleSort}
          updatingStatusId={data.updatingStatusId} handleStatusChange={data.handleStatusChange}
          copiedId={data.copiedId} copyEmail={data.copyEmail}
          deletingId={data.deletingId} handleDelete={data.handleDelete}
          setSelectedLead={data.setSelectedLead}
        />
      )}

      <LeadDetailSheet
        selectedLead={data.selectedLead} setSelectedLead={data.setSelectedLead}
        updatingStatusId={data.updatingStatusId} handleStatusChange={data.handleStatusChange}
        copiedId={data.copiedId} copyEmail={data.copyEmail}
        deletingId={data.deletingId} handleDelete={data.handleDelete}
        notes={data.notes} notesLoading={data.notesLoading}
        newNote={data.newNote} setNewNote={data.setNewNote}
        savingNote={data.savingNote} deletingNoteId={data.deletingNoteId}
        handleAddNote={data.handleAddNote} handleDeleteNote={data.handleDeleteNote}
        followupDate={data.followupDate} setFollowupDate={data.setFollowupDate}
        savingFollowup={data.savingFollowup} followupSaved={data.followupSaved}
        handleSaveFollowup={data.handleSaveFollowup} handleClearFollowup={data.handleClearFollowup}
      />
    </div>
  )
}
