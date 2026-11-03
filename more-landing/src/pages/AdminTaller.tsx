import { CheckCircle2, Circle, Download, FlaskConical, Loader2, MessageCircle, RefreshCw, Search, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MasterclassLead } from "@/lib/supabase"
import { buildPaymentUrl, type PriceTier, type TicketType } from "@/components/sections/taller-nov-26/tallerNov26Copy"
import {
  chargeFor,
  useTallerInscritos,
  type InscritoFilter,
} from "@/components/admin/taller/useTallerInscritos"

const FILTERS: { id: InscritoFilter; label: string }[] = [
  { id: "por-cobrar", label: "Por cobrar" },
  { id: "pagados", label: "Pagados" },
  { id: "todos", label: "Todos" },
  { id: "pruebas", label: "Pruebas" },
]

const usd = (n: number) =>
  `$${n.toLocaleString("es-CO", { maximumFractionDigits: 2 })} USD`

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  })

/** Link de WhatsApp con el mensaje de cobro listo (incluye el link de pago si existe). */
function whatsappChargeUrl(lead: MasterclassLead, price: string, link: string): string | null {
  const digits = (lead.whatsapp ?? "").replace(/\D/g, "")
  if (!digits) return null
  const firstName = lead.nombre.trim().split(/\s+/)[0]
  const entrada = lead.ticket_type === "vip" ? "VIP" : "General"
  const paymentUrl = buildPaymentUrl(link, lead.email)
  const body = lead.ticket_type
    ? paymentUrl
      ? `Hola ${firstName}, gracias por inscribirte al Taller Comunidad More del lunes 23 de noviembre (7:00 PM, hora Colombia). Para asegurar tu lugar en la entrada ${entrada} (${price}), completa tu pago aquí: ${paymentUrl}`
      : `Hola ${firstName}, gracias por inscribirte al Taller Comunidad More del lunes 23 de noviembre (7:00 PM, hora Colombia). Tu entrada es ${entrada} (${price}). En breve te compartimos el enlace de pago.`
    : `Hola ${firstName}, gracias por inscribirte al Taller Comunidad More del lunes 23 de noviembre (7:00 PM, hora Colombia). ¿Qué entrada prefieres: General o VIP?`
  return `https://wa.me/${digits}?text=${encodeURIComponent(body)}`
}

function exportCsv(rows: MasterclassLead[], settings: Parameters<typeof chargeFor>[1]) {
  const header = ["Fecha", "Nombre", "Email", "WhatsApp", "País", "Entrada", "Versión", "Monto", "Estado", "Pagado el", "Prueba", "Nota", "utm_source", "utm_campaign"]
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const lines = rows.map((l) => {
    const { price } = chargeFor(l, settings)
    return [
      dateLabel(l.created_at), l.nombre, l.email, l.whatsapp, l.country,
      l.ticket_type ?? "", l.price_tier ?? "", price,
      l.payment_status === "paid" ? "Pagado" : "Por cobrar",
      l.paid_at ? dateLabel(l.paid_at) : "", l.is_test ? "Sí" : "", l.payment_note, l.utm_source, l.utm_campaign,
    ].map(esc).join(",")
  })
  // BOM para que Excel abra bien los acentos.
  const blob = new Blob(["﻿" + [header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = `inscritos-taller-23nov-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function AdminTaller() {
  const {
    settings, visible, leads, loading, error, savingId, filter, setFilter, search, setSearch,
    stats, reload, togglePaid, setTicket, setTier, toggleTest,
  } = useTallerInscritos()

  const kpis = [
    { label: "Inscritos", value: String(stats.inscritos) },
    { label: "Pagados", value: String(stats.pagados) },
    { label: "Por cobrar", value: `${stats.porCobrar} · ${usd(stats.montoPorCobrar)}` },
    { label: "Recaudado", value: usd(stats.recaudado) },
  ]

  return (
    <div className="min-h-full bg-admin-app">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-admin border border-admin-border bg-admin-subtle">
              <Ticket className="h-5 w-5 text-orange" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-admin-text">Inscritos al taller</h1>
              <p className="text-sm text-admin-faint">
                Taller Comunidad More · Lunes 23 nov, 7:00 PM (Colombia) · público y comunidad
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" /> Actualizar
            </button>
            <button
              type="button"
              onClick={() => exportCsv(visible, settings)}
              disabled={visible.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy-light disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Exportar CSV
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-400">{k.label}</p>
              <p className="mt-1 text-xl font-bold text-navy">{k.value}</p>
            </div>
          ))}
        </div>

        {stats.sinEntrada > 0 && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {stats.sinEntrada} inscrito(s) sin entrada definida: elige General o VIP en la tabla para calcular el monto.
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    filter === f.id ? "bg-orange text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar nombre, correo o WhatsApp"
                className="w-64 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange"
              />
            </label>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 px-4 py-10 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando inscritos…
            </div>
          ) : visible.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              {leads.length === 0 ? "Todavía no hay inscritos." : "No hay inscritos en este filtro."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Inscrito</th>
                    <th className="px-4 py-3">Entrada</th>
                    <th className="px-4 py-3">Versión</th>
                    <th className="px-4 py-3">Monto</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((lead) => {
                    const { price, link } = chargeFor(lead, settings)
                    const wa = whatsappChargeUrl(lead, price, link)
                    const paid = lead.payment_status === "paid"
                    const saving = savingId === lead.id
                    return (
                      <tr key={lead.id} className={cn(lead.is_test && "opacity-60")}>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-500">{dateLabel(lead.created_at)}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-navy">{lead.nombre}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                          <p className="text-xs text-gray-500">
                            {lead.whatsapp ?? "Sin WhatsApp"}
                            {lead.country ? ` · ${lead.country}` : ""}
                          </p>
                          {lead.payment_note && <p className="mt-1 text-xs italic text-gray-400">{lead.payment_note}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.ticket_type ?? ""}
                            onChange={(e) => void setTicket(lead, (e.target.value || null) as TicketType | null)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm"
                          >
                            <option value="">Sin definir</option>
                            <option value="general">General</option>
                            <option value="vip">VIP</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={lead.price_tier ?? "publico"}
                            onChange={(e) => void setTier(lead, e.target.value as PriceTier)}
                            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm"
                          >
                            <option value="publico">Público</option>
                            <option value="comunidad">Comunidad</option>
                          </select>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-navy">{price || "—"}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => void togglePaid(lead)}
                            disabled={saving}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                              paid ? "border-green-200 bg-green-50 text-green-700" : "border-amber-200 bg-amber-50 text-amber-700",
                            )}
                            title={paid ? "Marcar como por cobrar" : "Marcar como pagado"}
                          >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : paid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                            {paid ? "Pagado" : "Por cobrar"}
                          </button>
                          {paid && lead.paid_at && <p className="mt-1 text-[11px] text-gray-400">{dateLabel(lead.paid_at)}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {wa && (
                              <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-100"
                                title="Abrir WhatsApp con el mensaje de cobro"
                              >
                                <MessageCircle className="h-3.5 w-3.5" /> {lead.ticket_type ? "Cobrar" : "Preguntar entrada"}
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => void toggleTest(lead)}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
                              title={lead.is_test ? "Quitar marca de prueba" : "Marcar como prueba (no cuenta en totales)"}
                            >
                              <FlaskConical className="h-3.5 w-3.5" /> {lead.is_test ? "Es prueba" : "Prueba"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Montos según la entrada y la versión de cada inscrito, con los precios de Configuración → Taller Comunidad.
          Los registros marcados como prueba no cuentan en los totales.
        </p>
      </div>
    </div>
  )
}
