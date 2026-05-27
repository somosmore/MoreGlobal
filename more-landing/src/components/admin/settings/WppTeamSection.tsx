import { useRef, useState } from "react"
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
  Trash2,
  X,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import type { WppTeamNumber } from "@/lib/supabase"
import { WPPEQUIPO_PUBLIC_URL, isValidWhatsappUrl } from "@/lib/wppEquipo"
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

export default function WppTeamSection() {
  const data = useWppTeamData()
  const qrRef = useRef<HTMLDivElement>(null)
  const [form, setForm] = useState<NumberFormState>(initialForm)
  const [formSaving, setFormSaving] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-[#2A3A4A]">
                  Números del equipo ({data.numbers.length})
                </h3>
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F37021] text-white text-sm font-medium hover:bg-[#D4611A] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar número
                </button>
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
    </div>
  )
}
