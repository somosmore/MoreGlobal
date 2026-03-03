import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { supabase, type Lead, type Testimonial } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Award,
  CalendarDays,
  ArrowRight,
  Clock,
  MessageCircle,
  ExternalLink,
  BarChart3,
} from "lucide-react"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RESULT_LABELS: Record<string, string> = {
  alto_impacto: "Alto Impacto",
  unsung: "Unsung",
}

const STATUS_META: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  nuevo: {
    label: "Nuevo",
    color: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  contactado: {
    label: "Contactado",
    color: "bg-yellow-50 text-yellow-700",
    dot: "bg-yellow-400",
  },
  en_consulta: {
    label: "En consulta",
    color: "bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  calificado: {
    label: "Calificado",
    color: "bg-green-50 text-green-700",
    dot: "bg-green-500",
  },
  cerrado: {
    label: "Cerrado",
    color: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  perdido: {
    label: "Perdido",
    color: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "ahora mismo"
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `hace ${days}d`
  return `hace ${Math.floor(days / 30)}mes`
}

function waLink(lead: Lead): string {
  const num = (lead.whatsapp ?? "").replace(/\D/g, "")
  const name = encodeURIComponent(lead.nombre)
  return `https://wa.me/${num}?text=Hola%20${name},%20te%20contactamos%20desde%20MORE%20Immigration%20Consulting.`
}

// ─── Funnel bar ───────────────────────────────────────────────────────────────

type FunnelStep = { label: string; value: number; color: string }

function FunnelBar({ steps }: { steps: FunnelStep[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1)
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24 shrink-0 truncate">
            {step.label}
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step.color}`}
              style={{ width: `${(step.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-[#2A3A4A] w-6 text-right shrink-0">
            {step.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    const fetchAll = async () => {
      setLoading(true)
      const [leadsRes, testiRes] = await Promise.all([
        supabase!.from("leads").select("*").order("created_at", { ascending: false }),
        supabase!.from("testimonials").select("id, category, media_type, created_at"),
      ])
      setLeads((leadsRes.data ?? []) as Lead[])
      setTestimonials((testiRes.data ?? []) as unknown as Testimonial[])
      setLoading(false)
    }
    fetchAll()
  }, [])

  const today = new Date().toDateString()

  const stats = useMemo(
    () => ({
      totalLeads: leads.length,
      altoImpacto: leads.filter((l) => l.result_type === "alto_impacto").length,
      unsung: leads.filter((l) => l.result_type === "unsung").length,
      hoy: leads.filter(
        (l) => new Date(l.created_at).toDateString() === today
      ).length,
      calificados: leads.filter((l) => l.status === "calificado").length,
      totalTestimonials: testimonials.length,
      nuevos: leads.filter((l) => (l.status ?? "nuevo") === "nuevo").length,
      contactados: leads.filter((l) => l.status === "contactado").length,
      enConsulta: leads.filter((l) => l.status === "en_consulta").length,
      cerrados: leads.filter((l) => l.status === "cerrado").length,
      perdidos: leads.filter((l) => l.status === "perdido").length,
    }),
    [leads, testimonials, today]
  )

  const recentLeads = leads.slice(0, 8)

  const funnelSteps: FunnelStep[] = [
    { label: "Nuevos", value: stats.nuevos, color: "bg-blue-400" },
    { label: "Contactados", value: stats.contactados, color: "bg-yellow-400" },
    { label: "En consulta", value: stats.enConsulta, color: "bg-orange-400" },
    { label: "Calificados", value: stats.calificados, color: "bg-green-500" },
    { label: "Cerrados", value: stats.cerrados, color: "bg-gray-400" },
    { label: "Perdidos", value: stats.perdidos, color: "bg-red-400" },
  ]

  const kpiCards = [
    {
      label: "Total leads",
      value: stats.totalLeads,
      icon: Users,
      color: "text-[#2A3A4A]",
      bg: "bg-[#2A3A4A]/8",
      href: "/admin/leads",
    },
    {
      label: "Alto Impacto",
      value: stats.altoImpacto,
      icon: Sparkles,
      color: "text-[#F37021]",
      bg: "bg-[#F37021]/10",
      href: "/admin/leads",
    },
    {
      label: "Unsung",
      value: stats.unsung,
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/leads",
    },
    {
      label: "Recibidos hoy",
      value: stats.hoy,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/leads",
    },
    {
      label: "Calificados",
      value: stats.calificados,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/admin/leads",
    },
    {
      label: "Testimonios",
      value: stats.totalTestimonials,
      icon: MessageSquare,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/admin/testimonials",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-[#2A3A4A]">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Resumen general de actividad —{" "}
          {new Date().toLocaleDateString("es-CO", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} to={href}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div
                  className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-[#2A3A4A] leading-none">
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-1 leading-tight">
                  {label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h2 className="text-sm font-semibold text-[#2A3A4A]">
                    Leads recientes
                  </h2>
                </div>
                <Link
                  to="/admin/leads"
                  className="flex items-center gap-1 text-xs text-[#F37021] hover:text-[#F37021]/80 font-medium transition-colors"
                >
                  Ver todos <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentLeads.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  No hay leads aún
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {recentLeads.map((lead) => {
                    const sm =
                      STATUS_META[lead.status ?? "nuevo"] ??
                      STATUS_META["nuevo"]
                    return (
                      <li
                        key={lead.id}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50/80 transition-colors"
                      >
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-xl bg-[#2A3A4A]/8 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#2A3A4A]">
                            {lead.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        {/* Name + email */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2A3A4A] truncate">
                            {lead.nombre}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {lead.email}
                          </p>
                        </div>

                        {/* Result badge */}
                        <span
                          className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            lead.result_type === "alto_impacto"
                              ? "bg-[#F37021]/10 text-[#F37021]"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {RESULT_LABELS[lead.result_type] ?? lead.result_type}
                        </span>

                        {/* Status */}
                        <span
                          className={`hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${sm.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}
                          />
                          {sm.label}
                        </span>

                        {/* Time + actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] text-gray-400 hidden lg:block mr-1">
                            {timeAgo(lead.created_at)}
                          </span>
                          {lead.whatsapp && (
                            <a
                              href={waLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <a
                            href={`mailto:${lead.email}`}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Email"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Pipeline funnel */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-[#2A3A4A]">
                  Pipeline de leads
                </h2>
              </div>
              <FunnelBar steps={funnelSteps} />
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold text-[#2A3A4A] mb-4">
                Acciones rápidas
              </h2>
              <div className="space-y-2">
                <Link
                  to="/admin/leads"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#2A3A4A]/5 hover:bg-[#2A3A4A]/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#2A3A4A]" />
                    <span className="text-sm font-medium text-[#2A3A4A]">
                      Gestionar leads
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/admin/testimonials"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F37021]/5 hover:bg-[#F37021]/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-[#F37021]" />
                    <span className="text-sm font-medium text-[#2A3A4A]">
                      Gestionar testimonios
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Conversion rate */}
          {stats.totalLeads > 0 && (
            <Card className="border-0 shadow-sm bg-gradient-to-br from-[#2A3A4A] to-[#3d5268] text-white">
              <CardContent className="p-6">
                <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mb-1">
                  Tasa de calificación
                </p>
                <p className="text-4xl font-bold mb-1">
                  {Math.round(
                    (stats.calificados / stats.totalLeads) * 100
                  )}
                  <span className="text-2xl font-normal text-white/70">%</span>
                </p>
                <p className="text-xs text-white/50">
                  {stats.calificados} de {stats.totalLeads} leads calificados
                </p>
                <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F37021] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.calificados / stats.totalLeads) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
