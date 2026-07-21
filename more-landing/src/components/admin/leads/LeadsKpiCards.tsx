import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Sparkles, Award, CalendarDays } from "lucide-react"

type Props = {
  stats: { total: number; altoImpacto: number; unsung: number; hoy: number; calificados: number }
}

const KPI_CONFIG = [
  { key: "total",       label: "Total leads",  icon: Users,        color: "text-navy",  bg: "bg-navy/5" },
  { key: "altoImpacto", label: "Alto Impacto",  icon: Sparkles,     color: "text-orange",  bg: "bg-orange/8" },
  { key: "unsung",      label: "Unsung",        icon: Award,        color: "text-purple-600", bg: "bg-purple-50" },
  { key: "hoy",         label: "Hoy",           icon: CalendarDays, color: "text-blue-600",   bg: "bg-blue-50" },
  { key: "calificados", label: "Calificados",   icon: TrendingUp,   color: "text-green-600",  bg: "bg-green-50" },
] as const

export default function LeadsKpiCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {KPI_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
        <Card key={key} className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy leading-none">{stats[key]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
