import { useState, useEffect, useCallback } from "react"
import { supabase, type WppTeamNumber } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { isValidWhatsappUrl } from "@/lib/wppEquipo"

export type SaveState = "idle" | "saving" | "success" | "error"

export function useWppTeamData() {
  const { settings, loading: settingsLoading, refetch: refetchSettings } = useSiteSettings()
  const [numbers, setNumbers] = useState<WppTeamNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wppequipoEnabled, setWppequipoEnabled] = useState(true)
  const [toggleSaveState, setToggleSaveState] = useState<SaveState>("idle")
  const [toggleSaveError, setToggleSaveError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchNumbers = useCallback(async () => {
    if (!supabase) {
      setError("No hay conexión con la base de datos.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from("wpp_team_numbers")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setNumbers((data as WppTeamNumber[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchNumbers()
  }, [fetchNumbers])

  useEffect(() => {
    if (!settingsLoading) {
      setWppequipoEnabled(settings.wppequipo_enabled.trim().toLowerCase() !== "false")
    }
  }, [settingsLoading, settings.wppequipo_enabled])

  const handleSaveEnabled = async (enabled: boolean) => {
    if (!supabase) {
      setToggleSaveError("No hay conexión con la base de datos.")
      setToggleSaveState("error")
      return
    }

    setToggleSaveState("saving")
    setToggleSaveError(null)

    const { error: err } = await supabase.from("site_settings").upsert(
      [{ key: "wppequipo_enabled", value: enabled ? "true" : "false" }],
      { onConflict: "key" }
    )

    if (err) {
      setToggleSaveError(err.message)
      setToggleSaveState("error")
      return
    }

    setWppequipoEnabled(enabled)
    setToggleSaveState("success")
    refetchSettings()
    setTimeout(() => setToggleSaveState("idle"), 3000)
  }

  const createNumber = async (label: string, url: string) => {
    if (!supabase) {
      setActionError("No hay conexión con la base de datos.")
      return false
    }

    const trimmedLabel = label.trim()
    const trimmedUrl = url.trim()

    if (!trimmedLabel) {
      setActionError("El nombre es obligatorio.")
      return false
    }

    if (!isValidWhatsappUrl(trimmedUrl)) {
      setActionError("La URL debe ser un enlace válido de WhatsApp (wa.me, wa.link, etc.).")
      return false
    }

    setActionError(null)

    const maxOrder = numbers.reduce((max, n) => Math.max(max, n.sort_order), -1)

    const { error: err } = await supabase.from("wpp_team_numbers").insert({
      label: trimmedLabel,
      url: trimmedUrl,
      is_active: true,
      sort_order: maxOrder + 1,
    })

    if (err) {
      setActionError(err.message)
      return false
    }

    await fetchNumbers()
    return true
  }

  const updateNumber = async (id: string, label: string, url: string) => {
    if (!supabase) {
      setActionError("No hay conexión con la base de datos.")
      return false
    }

    const trimmedLabel = label.trim()
    const trimmedUrl = url.trim()

    if (!trimmedLabel) {
      setActionError("El nombre es obligatorio.")
      return false
    }

    if (!isValidWhatsappUrl(trimmedUrl)) {
      setActionError("La URL debe ser un enlace válido de WhatsApp (wa.me, wa.link, etc.).")
      return false
    }

    setActionError(null)

    const { error: err } = await supabase
      .from("wpp_team_numbers")
      .update({ label: trimmedLabel, url: trimmedUrl })
      .eq("id", id)

    if (err) {
      setActionError(err.message)
      return false
    }

    await fetchNumbers()
    return true
  }

  const toggleNumberActive = async (id: string, isActive: boolean) => {
    if (!supabase) {
      setActionError("No hay conexión con la base de datos.")
      return false
    }

    setActionError(null)

    const { error: err } = await supabase
      .from("wpp_team_numbers")
      .update({ is_active: isActive })
      .eq("id", id)

    if (err) {
      setActionError(err.message)
      return false
    }

    await fetchNumbers()
    return true
  }

  const deleteNumber = async (id: string) => {
    if (!supabase) {
      setActionError("No hay conexión con la base de datos.")
      return false
    }

    setActionError(null)

    const { error: err } = await supabase.from("wpp_team_numbers").delete().eq("id", id)

    if (err) {
      setActionError(err.message)
      return false
    }

    await fetchNumbers()
    return true
  }

  return {
    numbers,
    loading: loading || settingsLoading,
    error,
    wppequipoEnabled,
    toggleSaveState,
    toggleSaveError,
    actionError,
    setActionError,
    handleSaveEnabled,
    createNumber,
    updateNumber,
    toggleNumberActive,
    deleteNumber,
    refetch: fetchNumbers,
  }
}

export type WppTeamData = ReturnType<typeof useWppTeamData>
