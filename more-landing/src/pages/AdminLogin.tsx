import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: err } = await signIn(email, password)
    setSubmitting(false)
    if (err) {
      setError(err.message ?? "Error al iniciar sesión")
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="admin-shell min-h-screen bg-admin flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-admin-lg border border-admin-border bg-admin-elevated p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/icon.png"
            alt=""
            className="h-14 w-14 rounded-admin border border-admin-border-strong mb-4"
          />
          <img
            src="/logo_more_dark.png"
            alt="MORE"
            className="h-10 w-auto object-contain mb-3"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange">
            Admin // OS
          </p>
          <p className="text-sm text-admin-faint mt-2">
            Iniciá sesión para operar el sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-faint mb-1.5"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
              autoComplete="email"
              className="bg-admin-subtle border-admin-border-strong text-admin-text"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-admin-faint mb-1.5"
            >
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-admin-subtle border-admin-border-strong text-admin-text"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-admin-sm bg-orange hover:bg-orange-dark text-white border-0 shadow-none h-11"
            disabled={submitting}
          >
            {submitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
