import type { Lead, LeadStatus } from "@/lib/supabase"
import {
  Trash2, MessageCircle, Copy, ChevronUp, ChevronDown,
  ChevronsUpDown, CheckCheck, Bell,
} from "lucide-react"
import { timeAgo, waLink, followupState, type SortField, type SortDir } from "./helpers"
import {
  RESULT_LABELS, ACADEMIC_LABELS, AREA_LABELS,
  SEGMENT_LABELS, ROUTE_LABELS, STATUS_OPTIONS, statusMeta,
} from "./constants"

type Props = {
  displayed: Lead[]
  sortField: SortField
  sortDir: SortDir
  toggleSort: (field: SortField) => void
  updatingStatusId: string | null
  handleStatusChange: (id: string, status: LeadStatus) => void
  copiedId: string | null
  copyEmail: (lead: Lead) => void
  deletingId: string | null
  handleDelete: (id: string) => void
  setSelectedLead: (lead: Lead) => void
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 opacity-40" />
  return sortDir === "asc"
    ? <ChevronUp className="w-3 h-3 text-orange" />
    : <ChevronDown className="w-3 h-3 text-orange" />
}

function FollowupBadge({ followup_at }: { followup_at: string | null | undefined }) {
  const state = followupState(followup_at)
  if (!state) return null
  const map = {
    overdue: { cls: "text-red-400 bg-red-500/15", title: "Seguimiento vencido" },
    today:   { cls: "text-amber-400 bg-amber-500/15", title: "Seguimiento hoy" },
    soon:    { cls: "text-blue-400 bg-blue-500/15", title: "Seguimiento próximo" },
  }
  const { cls, title } = map[state]
  return (
    <span className={`inline-flex items-center rounded-admin-sm p-1 ${cls}`} title={title}>
      <Bell className="w-3 h-3" />
    </span>
  )
}

export default function LeadsTable({
  displayed, sortField, sortDir, toggleSort,
  updatingStatusId, handleStatusChange,
  copiedId, copyEmail, deletingId, handleDelete, setSelectedLead,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1 hover:text-navy">
                Fecha <SortIcon field="created_at" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button onClick={() => toggleSort("nombre")} className="flex items-center gap-1 hover:text-navy">
                Nombre <SortIcon field="nombre" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Contacto
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Perfil
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button onClick={() => toggleSort("result_type")} className="flex items-center gap-1 hover:text-navy">
                Resultado <SortIcon field="result_type" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-navy">
                Estado <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
              </button>
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((lead) => {
            const sm = statusMeta(lead.status ?? "nuevo")
            return (
              <tr
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-xs text-gray-700 font-medium block">{timeAgo(lead.created_at)}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-navy block">{lead.nombre}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()}
                    className="text-xs text-gray-600 hover:text-orange transition-colors block truncate max-w-[180px]">
                    {lead.email}
                  </a>
                  {lead.whatsapp && <span className="text-[11px] text-gray-400">{lead.whatsapp}</span>}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-gray-500 block">
                    {ACADEMIC_LABELS[lead.academic_level] ?? lead.academic_level}
                  </span>
                  <span className="text-[11px] text-gray-400 block">
                    {AREA_LABELS[lead.impact_area] ?? lead.impact_area}
                  </span>
                  {(lead.country_residence || lead.nationality) && (
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {`${lead.country_residence ?? ""}${lead.country_residence && lead.nationality ? " · " : ""}${lead.nationality ?? ""}`}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 space-y-1">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    lead.result_type === "alto_impacto" ? "bg-orange/10 text-orange" : "bg-purple-50 text-purple-700"
                  }`}>
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
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={lead.status ?? "nuevo"}
                    disabled={updatingStatusId === lead.id}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border appearance-none cursor-pointer pr-6 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange/30 transition-all ${sm.color} ${updatingStatusId === lead.id ? "opacity-50" : ""}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
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
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
