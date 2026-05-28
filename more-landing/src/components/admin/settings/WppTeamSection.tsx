import { useMemo, useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  QrCode,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { WppTeamNumber } from "@/lib/supabase"
import {
  WPPEQUIPO_PUBLIC_URL,
  isValidWhatsappUrl,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY_CODE,
  parseBulkPhoneList,
  normalizePhone,
  type ParsedBulkEntry,
} from "@/lib/wppEquipo"
import { useWppTeamData } from "./useWppTeamData"

type FormMode = "create" | "edit"

type NumberFormState = {
  open: boolean
  mode: FormMode
  editingId: string | null
  label: string
  url: string
}

const initialForm: NumberFormState = {
  open: false,
  mode: "create",
  editingId: null,
  label: "",
  url: "",
}

type BulkImportState = {
  open: boolean
  text: string
  defaultCountry: string
  entries: ParsedBulkEntry[]
  parsed: boolean
  saving: boolean
  resultMessage: string | null
  resultType: "success" | "error" | null
}

const initialBulkState: BulkImportState = {
  open: false,
  text: "",
  defaultCountry: DEFAULT_COUNTRY_CODE,
  entries: [],
  parsed: false,
  saving: false,
  resultMessage: null,
  resultType: null,
}

export default function WppTeamSection() {
  const data = useWppTeamData()
  const qrRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<NumberFormState>(initialForm)
  const [formSaving, setFormSaving] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulk, setBulk] = useState<BulkImportState>(initialBulkState)

  const bulkStats = useMemo(() => {
    const total = bulk.entries.length
    const valid = bulk.entries.filter((e) => e.valid).length
    return { total, valid, invalid: total - valid }
  }, [bulk.entries])

  const handleOpenCreate = () => {
    setForm({ open: true, mode: "create", editingId: null, label: "", url: "" })
    data.setActionError(null)
  }

  const handleOpenEdit = (item: WppTeamNumber) => {
    setForm({
      open: true,
      mode: "edit",
      editingId: item.id,
      label: item.label,
      url: item.url,
    })
    data.setActionError(null)
  }

  const handleCloseForm = () => {
    setForm(initialForm)
    data.setActionError(null)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(WPPEQUIPO_PUBLIC_URL)
      setCopyState("copied")
      setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("idle")
    }
  }

  const handleDownloadQr = async () => {
    if (!qrRef.current) return
    const canvas = await html2canvas(qrRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    })
    const link = document.createElement("a")
    link.download = "qr-wppequipo.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const handleSubmitForm = async () => {
    setFormSaving(true)
    let ok = false

    if (form.mode === "create") {
      ok = await data.createNumber(form.label, form.url)
    } else if (form.editingId) {
      ok = await data.updateNumber(form.editingId, form.label, form.url)
    }

    setFormSaving(false)
    if (ok) handleCloseForm()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este número de WhatsApp?")) return
    setDeletingId(id)
    await data.deleteNumber(id)
    setDeletingId(null)
  }

  const handleOpenBulk = () => {
    setBulk(initialBulkState)
    setBulk((b) => ({ ...b, open: true }))
    data.setActionError(null)
  }

  const handleCloseBulk = () => {
    setBulk(initialBulkState)
  }

  const handleParseBulk = () => {
    const entries = parseBulkPhoneList(bulk.text, bulk.defaultCountry)
    setBulk((b) => ({ ...b, entries, parsed: true, resultMessage: null, resultType: null }))
  }

  const handleChangeBulkCountry = (code: string) => {
    setBulk((b) => {
      if (!b.parsed) return { ...b, defaultCountry: code }
      const reparsed = parseBulkPhoneList(b.text, code)
      return { ...b, defaultCountry: code, entries: reparsed }
    })
  }

  const handleUpdateEntry = (id: string, field: "label" | "rawPhone", value: string) => {
    setBulk((b) => {
      const entries = b.entries.map((entry) => {
        if (entry.id !== id) return entry
        if (field === "label") {
          const newLabel = value
          const labelEmpty = newLabel.trim().length === 0
          const phoneValid = entry.digits.length >= 10
          return {
            ...entry,
            label: newLabel,
            valid: !labelEmpty && phoneValid,
            error: labelEmpty
              ? "Falta nombre"
              : !phoneValid
                ? "Número inválido"
                : undefined,
          }
        }
        const normalized = normalizePhone(value, b.defaultCountry)
        const labelOk = entry.label.trim().length > 0
        return {
          ...entry,
          rawPhone: value,
          digits: normalized.digits,
          url: normalized.url,
          display: normalized.display,
          valid: normalized.valid && labelOk,
          error: !labelOk
            ? "Falta nombre"
            : !normalized.valid
              ? "Número inválido"
              : undefined,
        }
      })
      return { ...b, entries }
    })
  }

  const handleRemoveEntry = (id: string) => {
    setBulk((b) => ({ ...b, entries: b.entries.filter((e) => e.id !== id) }))
  }

  const handleConfirmBulkImport = async () => {
    const validEntries = bulk.entries.filter((e) => e.valid)
    if (validEntries.length === 0) return

    setBulk((b) => ({ ...b, saving: true, resultMessage: null, resultType: null }))
    const payload = validEntries.map((e) => ({ label: e.label.trim(), url: e.url }))
    const result = await data.bulkCreateNumbers(payload)

    if (result.error) {
      setBulk((b) => ({
        ...b,
        saving: false,
        resultMessage: result.error ?? "No se pudo importar.",
        resultType: "error",
      }))
      return
    }

    setBulk({
      ...initialBulkState,
      open: true,
      resultMessage: `Se importaron ${result.success} números correctamente${
        result.failed > 0 ? ` (${result.failed} inválidos descartados)` : ""
      }.`,
      resultType: "success",
    })
    setTimeout(() => setBulk(initialBulkState), 2500)
  }

  const urlInvalid = form.url.trim().length > 0 && !isValidWhatsappUrl(form.url)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-[#128C7E]" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[#2A3A4A]">
            WhatsApp Equipo (/wppequipo)
          </h2>
          <p className="text-xs text-gray-400">
            Gestiona los números que reciben visitantes desde{" "}
            <span className="font-mono text-gray-500">{WPPEQUIPO_PUBLIC_URL}</span>
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {data.loading ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Cargando configuración…
          </div>
        ) : (
          <>
            {data.error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{data.error}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#2A3A4A]">Página activa</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Si está desactivada, los visitantes caen al WhatsApp general del sitio.
                </p>
              </div>
              <Switch
                checked={data.wppequipoEnabled}
                onCheckedChange={(checked) => data.handleSaveEnabled(checked)}
                disabled={data.toggleSaveState === "saving"}
                aria-label="Activar página wppequipo"
              />
            </div>

            {data.toggleSaveState === "success" && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Estado de la página guardado.
              </div>
            )}

            {data.toggleSaveState === "error" && data.toggleSaveError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{data.toggleSaveError}</span>
              </div>
            )}

            <div className="rounded-xl border border-gray-200 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#2A3A4A]" />
                <h3 className="text-sm font-semibold text-[#2A3A4A]">
                  Enlace y código QR para compartir
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div
                  ref={qrRef}
                  className="shrink-0 rounded-xl border border-gray-100 bg-white p-3"
                >
                  <QRCodeSVG
                    value={WPPEQUIPO_PUBLIC_URL}
                    size={160}
                    level="M"
                    includeMargin
                  />
                </div>

                <div className="flex-1 space-y-3 w-full min-w-0">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="wppequipo-share-url"
                      className="block text-xs font-medium text-gray-500"
                    >
                      URL pública
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="wppequipo-share-url"
                        type="text"
                        readOnly
                        value={WPPEQUIPO_PUBLIC_URL}
                        className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono text-[#2A3A4A]"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#2A3A4A] hover:bg-gray-50 transition-colors"
                        aria-label="Copiar enlace"
                      >
                        <Copy className="w-4 h-4" />
                        {copyState === "copied" ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={WPPEQUIPO_PUBLIC_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-[#2A3A4A] hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir página
                    </a>
                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A3A4A] text-white text-sm font-medium hover:bg-[#3A4D5E] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Descargar QR (PNG)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#2A3A4A]">
                  Números del equipo ({data.numbers.length})
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenBulk}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#2A3A4A]/15 bg-white text-sm font-medium text-[#2A3A4A] hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Importar lista
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F37021] text-white text-sm font-medium hover:bg-[#D4611A] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar número
                  </button>
                </div>
              </div>

              {data.actionError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{data.actionError}</span>
                </div>
              )}

              {data.numbers.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-xl">
                  No hay números configurados. Agregá al menos uno o se usará el WhatsApp general.
                </p>
              ) : (
                <ul className="space-y-2">
                  {data.numbers.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2A3A4A]">{item.label}</p>
                        <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                          {item.url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={(checked) =>
                            data.toggleNumberActive(item.id, checked)
                          }
                          aria-label={`Activar ${item.label}`}
                        />
                        <span className="text-xs text-gray-400 w-14">
                          {item.is_active ? "Activo" : "Inactivo"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-[#2A3A4A] transition-colors"
                          aria-label={`Editar ${item.label}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          aria-label={`Eliminar ${item.label}`}
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {form.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wpp-form-title"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 id="wpp-form-title" className="text-sm font-semibold text-[#2A3A4A]">
                {form.mode === "create" ? "Agregar número" : "Editar número"}
              </h3>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="wpp-label" className="block text-sm font-medium text-[#2A3A4A]">
                  Nombre / etiqueta
                </label>
                <input
                  id="wpp-label"
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  placeholder="Ej: Sandra, Hugo, Equipo general"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#F37021] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="wpp-url" className="block text-sm font-medium text-[#2A3A4A]">
                  Enlace de WhatsApp
                </label>
                <input
                  id="wpp-url"
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://wa.me/..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors
                    ${
                      urlInvalid
                        ? "border-red-300 bg-red-50 focus:border-red-400"
                        : "border-gray-200 bg-gray-50 focus:border-[#F37021] focus:bg-white"
                    }`}
                />
                {urlInvalid && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Usá un enlace wa.me, wa.link, api.whatsapp.com o chat.whatsapp.com
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmitForm}
                  disabled={
                    formSaving ||
                    !form.label.trim() ||
                    !form.url.trim() ||
                    urlInvalid
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2A3A4A] text-white text-sm font-medium hover:bg-[#3A4D5E] disabled:opacity-50"
                >
                  {formSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {form.mode === "create" ? "Agregar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bulk.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wpp-bulk-title"
        >
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F37021]" />
                <h3 id="wpp-bulk-title" className="text-sm font-semibold text-[#2A3A4A]">
                  Importar lista de números
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseBulk}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {bulk.resultType === "success" && bulk.resultMessage && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bulk.resultMessage}</span>
                </div>
              )}
              {bulk.resultType === "error" && bulk.resultMessage && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{bulk.resultMessage}</span>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label
                    htmlFor="wpp-bulk-text"
                    className="block text-sm font-medium text-[#2A3A4A]"
                  >
                    Pegá la lista (índice, nombre y teléfono, una línea cada uno)
                  </label>
                  <textarea
                    id="wpp-bulk-text"
                    value={bulk.text}
                    onChange={(e) =>
                      setBulk((b) => ({ ...b, text: e.target.value, parsed: false }))
                    }
                    rows={8}
                    placeholder={"36\nAndres Chancusig\n0989812877\n37\nJose Forero\n954932639"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono outline-none focus:border-[#F37021] focus:bg-white resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="wpp-bulk-country"
                    className="block text-sm font-medium text-[#2A3A4A]"
                  >
                    País por defecto
                  </label>
                  <select
                    id="wpp-bulk-country"
                    value={bulk.defaultCountry}
                    onChange={(e) => handleChangeBulkCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#F37021] focus:bg-white"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} (+{c.code})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400">
                    Se aplica solo a números sin prefijo internacional. Los que ya traen código de país se respetan.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleParseBulk}
                  disabled={!bulk.text.trim()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A3A4A] text-white text-sm font-medium hover:bg-[#3A4D5E] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Procesar y previsualizar
                </button>
                {bulk.parsed && (
                  <span className="text-xs text-gray-500">
                    {bulkStats.valid} válidos · {bulkStats.invalid} con errores · {bulkStats.total} totales
                  </span>
                )}
              </div>

              {bulk.parsed && bulk.entries.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                  No se detectó ningún número en el texto. Revisá el formato y volvé a procesar.
                </p>
              )}

              {bulk.parsed && bulk.entries.length > 0 && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500">
                    <div className="col-span-4">Nombre</div>
                    <div className="col-span-3">Teléfono original</div>
                    <div className="col-span-4">URL WhatsApp</div>
                    <div className="col-span-1 text-right">Acción</div>
                  </div>
                  <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {bulk.entries.map((entry) => (
                      <li
                        key={entry.id}
                        className={`grid grid-cols-1 sm:grid-cols-12 gap-2 px-3 py-2.5 text-sm items-center ${
                          entry.valid ? "" : "bg-red-50/40"
                        }`}
                      >
                        <div className="sm:col-span-4">
                          <input
                            type="text"
                            value={entry.label}
                            onChange={(e) =>
                              handleUpdateEntry(entry.id, "label", e.target.value)
                            }
                            placeholder="Nombre"
                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-[#F37021]"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            value={entry.rawPhone}
                            onChange={(e) =>
                              handleUpdateEntry(entry.id, "rawPhone", e.target.value)
                            }
                            placeholder="Teléfono"
                            className="w-full px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm font-mono outline-none focus:border-[#F37021]"
                          />
                        </div>
                        <div className="sm:col-span-4 min-w-0">
                          {entry.valid ? (
                            <a
                              href={entry.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-[#128C7E] hover:underline truncate block"
                              title={entry.url}
                            >
                              {entry.url}
                            </a>
                          ) : (
                            <span className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              {entry.error ?? "Inválido"}
                            </span>
                          )}
                        </div>
                        <div className="sm:col-span-1 flex sm:justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(entry.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label="Quitar entrada"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCloseBulk}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkImport}
                disabled={bulk.saving || bulkStats.valid === 0}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F37021] text-white text-sm font-medium hover:bg-[#D4611A] disabled:opacity-50"
              >
                {bulk.saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Importar {bulkStats.valid} número{bulkStats.valid === 1 ? "" : "s"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
