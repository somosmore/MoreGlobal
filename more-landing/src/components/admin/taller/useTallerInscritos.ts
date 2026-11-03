import { useCallback, useEffect, useMemo, useState } from "react"
import { supabase, type MasterclassLead, type SiteSettingsMap } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import {
  TALLER_SOURCE,
  TICKETS,
  getTicketPricing,
  type PriceTier,
  type TicketType,
} from "@/components/sections/taller-nov-26/tallerNov26Copy"

export type InscritoFilter = "por-cobrar" | "pagados" | "todos" | "pruebas"

/** "$67 USD" → 67. Devuelve null si no hay número. */
export function parseAmount(price: string): number | null {
  const match = price.replace(/,/g, "").match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

/** Precio y link que le corresponden a un inscrito según su entrada y versión. */
export function chargeFor(
  lead: Pick<MasterclassLead, "ticket_type" | "price_tier">,
  settings: SiteSettingsMap,
) {
  if (!lead.ticket_type) return { price: "", amount: null, link: "" }
  const ticket = TICKETS.find((t) => t.id === lead.ticket_type)!
  const tier: PriceTier = lead.price_tier === "comunidad" ? "comunidad" : "publico"
  const { price, link } = getTicketPricing(ticket, settings, tier)
  return { price, amount: parseAmount(price), link }
}

type LeadUpdate = Partial<
  Pick<MasterclassLead, "payment_status" | "paid_at" | "payment_note" | "is_test" | "ticket_type" | "price_tier">
>

export function useTallerInscritos() {
  const { settings } = useSiteSettings()
  const [leads, setLeads] = useState<MasterclassLead[]>([])
  // Sin cliente de Supabase no hay nada que cargar: se resuelve en el estado inicial.
  const [loading, setLoading] = useState(() => Boolean(supabase))
  const [error, setError] = useState<string | null>(() =>
    supabase ? null : "No hay conexión con la base de datos.",
  )
  const [savingId, setSavingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<InscritoFilter>("por-cobrar")
  const [search, setSearch] = useState("")

  // `tick` fuerza una recarga ("Actualizar") sin llamar setState dentro del efecto.
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    supabase
      .from("masterclass_leads")
      .select("*")
      .eq("source", TALLER_SOURCE)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else {
          setError(null)
          setLeads((data ?? []) as MasterclassLead[])
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [tick])

  const load = useCallback(() => {
    setLoading(true)
    setTick((n) => n + 1)
  }, [])

  /** Actualiza un inscrito con actualización optimista; revierte si falla. */
  const update = useCallback(
    async (id: string, patch: LeadUpdate) => {
      if (!supabase) return
      const previous = leads
      setLeads((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
      setSavingId(id)
      const { error: err } = await supabase.from("masterclass_leads").update(patch).eq("id", id)
      setSavingId(null)
      if (err) {
        setLeads(previous)
        setError(`No se pudo guardar: ${err.message}`)
      } else {
        setError(null)
      }
    },
    [leads],
  )

  const togglePaid = (lead: MasterclassLead) =>
    update(
      lead.id,
      lead.payment_status === "paid"
        ? { payment_status: "pending", paid_at: null }
        : { payment_status: "paid", paid_at: new Date().toISOString() },
    )

  const setTicket = (lead: MasterclassLead, ticket: TicketType | null) =>
    update(lead.id, { ticket_type: ticket })

  const setTier = (lead: MasterclassLead, tier: PriceTier) => update(lead.id, { price_tier: tier })

  const toggleTest = (lead: MasterclassLead) => update(lead.id, { is_test: !lead.is_test })

  const real = useMemo(() => leads.filter((l) => !l.is_test), [leads])

  const stats = useMemo(() => {
    const paid = real.filter((l) => l.payment_status === "paid")
    const pending = real.filter((l) => l.payment_status !== "paid")
    const sum = (rows: MasterclassLead[]) =>
      rows.reduce((acc, l) => acc + (chargeFor(l, settings).amount ?? 0), 0)
    return {
      inscritos: real.length,
      pagados: paid.length,
      porCobrar: pending.length,
      montoPorCobrar: sum(pending),
      recaudado: sum(paid),
      sinEntrada: pending.filter((l) => !l.ticket_type).length,
    }
  }, [real, settings])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return leads
      .filter((l) => {
        if (filter === "pruebas") return l.is_test
        if (l.is_test) return false
        if (filter === "pagados") return l.payment_status === "paid"
        if (filter === "por-cobrar") return l.payment_status !== "paid"
        return true
      })
      .filter(
        (l) =>
          !term ||
          l.nombre.toLowerCase().includes(term) ||
          l.email.toLowerCase().includes(term) ||
          (l.whatsapp ?? "").includes(term),
      )
  }, [leads, filter, search])

  return {
    settings,
    leads,
    visible,
    loading,
    error,
    savingId,
    filter,
    setFilter,
    search,
    setSearch,
    stats,
    reload: load,
    togglePaid,
    setTicket,
    setTier,
    toggleTest,
  }
}
