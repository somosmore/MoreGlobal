import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { STATUS_OPTIONS } from "./constants"

type Props = {
  search: string
  setSearch: (v: string) => void
  filterResult: string
  setFilterResult: (v: string) => void
  filterStatus: string
  setFilterStatus: (v: string) => void
  filterSegment: string
  setFilterSegment: (v: string) => void
  filterRoute: string
  setFilterRoute: (v: string) => void
  exportCSV: () => void
  displayedCount: number
}

const selectClass =
  "text-sm border border-gray-200 rounded-lg px-3 h-9 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange/30"

export default function LeadsToolbar({
  search, setSearch, filterResult, setFilterResult,
  filterStatus, setFilterStatus, filterSegment, setFilterSegment,
  filterRoute, setFilterRoute, exportCSV, displayedCount,
}: Props) {
  return (
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
        <select value={filterResult} onChange={(e) => setFilterResult(e.target.value)} className={selectClass}>
          <option value="">Todos los resultados</option>
          <option value="alto_impacto">Alto Impacto</option>
          <option value="unsung">Unsung</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select value={filterSegment} onChange={(e) => setFilterSegment(e.target.value)} className={selectClass}>
          <option value="">Todos los segmentos</option>
          <option value="listo">Listo para aplicar</option>
          <option value="necesita_estructura">Necesita estructuración</option>
          <option value="no_califica_aun">No califica aún</option>
        </select>
        <select value={filterRoute} onChange={(e) => setFilterRoute(e.target.value)} className={selectClass}>
          <option value="">Todas las rutas</option>
          <option value="unsung_program">Programa Unsung</option>
          <option value="mentoria_more">Mentoría / Academia MORE</option>
          <option value="abogado">Referido a abogado</option>
          <option value="contenido">Contenido educativo</option>
        </select>
        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2 h-9" disabled={displayedCount === 0}>
          <Download className="w-4 h-4" /> CSV
        </Button>
      </div>
    </div>
  )
}
