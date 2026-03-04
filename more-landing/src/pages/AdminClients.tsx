import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Check,
  User,
  Mail,
  Phone,
  Building2,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Client, ClientInsert, ClientUpdate } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ClientFormData = Omit<ClientInsert, "id">

const emptyForm = (): ClientFormData => ({
  name: "",
  email: null,
  phone: null,
  company: null,
  notes: null,
})

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editingId, setEditingId] = useState<string | "new" | null>(null)
  const [formData, setFormData] = useState<ClientFormData>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("name")
    setClients((data as Client[]) ?? [])
    setLoading(false)
  }

  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      notes: client.notes,
    })
  }

  const handleNew = () => {
    setEditingId("new")
    setFormData(emptyForm())
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(emptyForm())
  }

  const handleSave = async () => {
    if (!supabase || !formData.name.trim()) return
    setSaving(true)

    const payload = { ...formData, name: formData.name.trim() }

    if (editingId === "new") {
      const { data, error } = await supabase
        .from("clients")
        .insert([payload])
        .select()
        .single()
      if (!error && data) {
        setClients((p) => [data as Client, ...p].sort((a, b) => a.name.localeCompare(b.name)))
        setEditingId(null)
      }
    } else if (editingId) {
      const update: ClientUpdate = payload
      const { data, error } = await supabase
        .from("clients")
        .update(update)
        .eq("id", editingId)
        .select()
        .single()
      if (!error && data) {
        setClients((p) =>
          p.map((c) => (c.id === editingId ? (data as Client) : c))
        )
        setEditingId(null)
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!supabase) return
    if (!confirm("¿Eliminar este cliente? Los proyectos vinculados quedarán sin cliente.")) return
    setDeleting(id)
    await supabase.from("clients").delete().eq("id", id)
    setClients((p) => p.filter((c) => c.id !== id))
    setDeleting(null)
  }

  const setField = (field: keyof ClientFormData, value: string | null) => {
    setFormData((p) => ({ ...p, [field]: value || null }))
  }

  const filtered = clients.filter(
    (c) =>
      !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2A3A4A]">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Contactos vinculados a proyectos de landing
          </p>
        </div>
        <Button onClick={handleNew} className="gap-2 shrink-0" variant="gold">
          <Plus className="w-4 h-4" />
          Nuevo cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre, empresa o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* New client form */}
      {editingId === "new" && (
        <ClientForm
          formData={formData}
          setField={setField}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
          isNew
        />
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          Cargando clientes...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
          <User className="w-10 h-10 text-gray-300" />
          <p className="text-sm text-gray-500">
            {search ? "No hay resultados para esa búsqueda." : "No hay clientes aún."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
          {filtered.map((client) =>
            editingId === client.id ? (
              <div key={client.id} className="p-4">
                <ClientForm
                  formData={formData}
                  setField={setField}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  saving={saving}
                />
              </div>
            ) : (
              <div
                key={client.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#2A3A4A]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#2A3A4A]/70">
                    {client.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-0.5 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2A3A4A] truncate">
                      {client.name}
                    </p>
                    {client.company && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <Building2 className="w-3 h-3 shrink-0" />
                        {client.company}
                      </p>
                    )}
                  </div>
                  {client.email && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate hidden sm:flex">
                      <Mail className="w-3 h-3 shrink-0 text-gray-400" />
                      {client.email}
                    </p>
                  )}
                  {client.phone && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate hidden sm:flex">
                      <Phone className="w-3 h-3 shrink-0 text-gray-400" />
                      {client.phone}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 text-gray-400 hover:text-[#2A3A4A] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    disabled={deleting === client.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}

// ─── Inline Form ──────────────────────────────────────────────────────────────

function ClientForm({
  formData,
  setField,
  onSave,
  onCancel,
  saving,
  isNew = false,
}: {
  formData: Omit<ClientInsert, "id">
  setField: (field: keyof Omit<ClientInsert, "id">, value: string | null) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  isNew?: boolean
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <p className="text-xs font-semibold text-[#2A3A4A] uppercase tracking-wide">
        {isNew ? "Nuevo cliente" : "Editar cliente"}
      </p>
      <Input
        placeholder="Nombre completo *"
        value={formData.name}
        onChange={(e) => setField("name", e.target.value)}
        autoFocus
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          placeholder="Empresa"
          value={formData.company ?? ""}
          onChange={(e) => setField("company", e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email ?? ""}
          onChange={(e) => setField("email", e.target.value)}
        />
        <Input
          type="tel"
          placeholder="Teléfono / WhatsApp"
          value={formData.phone ?? ""}
          onChange={(e) => setField("phone", e.target.value)}
        />
      </div>
      <textarea
        rows={2}
        placeholder="Notas internas (opcional)"
        value={formData.notes ?? ""}
        onChange={(e) => setField("notes", e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021]/30 focus:border-[#F37021] resize-none placeholder:text-gray-400 bg-white"
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onSave}
          disabled={saving || !formData.name.trim()}
          className="gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-3.5 h-3.5 mr-1" />
          Cancelar
        </Button>
      </div>
    </div>
  )
}
