import { useState, useEffect } from "react"
import { Search, Plus, User, X, Check } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Client, ClientInsert } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  value: Client | null
  onChange: (client: Client | null) => void
}

export default function ClientSelector({ value, onChange }: Props) {
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newClient, setNewClient] = useState<Omit<ClientInsert, "id">>({
    name: "",
    email: null,
    phone: null,
    company: null,
    notes: null,
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!search.trim()) {
      setClients([])
      return
    }
    const timeout = setTimeout(() => searchClients(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  const searchClients = async (q: string) => {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase
      .from("clients")
      .select("*")
      .or(`name.ilike.%${q}%,email.ilike.%${q}%,company.ilike.%${q}%`)
      .order("name")
      .limit(10)
    setClients(data ?? [])
    setLoading(false)
  }

  const handleSelect = (client: Client) => {
    onChange(client)
    setSearch("")
    setClients([])
  }

  const handleCreate = async () => {
    if (!supabase || !newClient.name.trim()) return
    setCreating(true)
    const { data, error } = await supabase
      .from("clients")
      .insert([{ ...newClient, name: newClient.name.trim() }])
      .select()
      .single()
    if (!error && data) {
      onChange(data as Client)
      setShowCreate(false)
      setNewClient({ name: "", email: null, phone: null, company: null, notes: null })
    }
    setCreating(false)
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#F37021]/40 bg-[#F37021]/5">
        <div className="w-10 h-10 rounded-full bg-[#2A3A4A] flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">
            {value.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#2A3A4A] truncate">{value.name}</p>
          {value.company && (
            <p className="text-xs text-gray-500 truncate">{value.company}</p>
          )}
          {value.email && (
            <p className="text-xs text-gray-400 truncate">{value.email}</p>
          )}
        </div>
        <button
          onClick={() => onChange(null)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Cambiar cliente"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar cliente por nombre, empresa o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Results */}
      {clients.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleSelect(client)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#2A3A4A]/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#2A3A4A]/60" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#2A3A4A] truncate">{client.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {[client.company, client.email].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Check className="w-4 h-4 text-[#F37021] ml-auto shrink-0 opacity-0 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      {loading && (
        <p className="text-xs text-gray-400 text-center py-2">Buscando...</p>
      )}

      {/* Create new */}
      {!showCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 text-sm text-[#F37021] hover:text-[#D4611A] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear nuevo cliente
        </button>
      ) : (
        <div className="p-4 border-2 border-dashed border-[#F37021]/30 rounded-xl space-y-3">
          <p className="text-xs font-semibold text-[#2A3A4A] uppercase tracking-wide">
            Nuevo cliente
          </p>
          <Input
            placeholder="Nombre completo *"
            value={newClient.name}
            onChange={(e) => setNewClient((p) => ({ ...p, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Empresa"
              value={newClient.company ?? ""}
              onChange={(e) =>
                setNewClient((p) => ({ ...p, company: e.target.value || null }))
              }
            />
            <Input
              type="email"
              placeholder="Email"
              value={newClient.email ?? ""}
              onChange={(e) =>
                setNewClient((p) => ({ ...p, email: e.target.value || null }))
              }
            />
          </div>
          <Input
            type="tel"
            placeholder="Teléfono / WhatsApp"
            value={newClient.phone ?? ""}
            onChange={(e) =>
              setNewClient((p) => ({ ...p, phone: e.target.value || null }))
            }
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={creating || !newClient.name.trim()}
              className="gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              {creating ? "Guardando..." : "Guardar cliente"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowCreate(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
