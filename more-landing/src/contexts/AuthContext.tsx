import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import type { UserRole } from "@/lib/supabase"

type AuthContextValue = {
  user: User | null
  session: Session | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchRole = async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single()
    setRole((data?.role as UserRole) ?? "standard")
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchRole(s.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchRole(s.user.id)
      } else {
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return {
        error: new Error(
          "Supabase no configurado. Añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env"
        ),
      }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ?? null }
  }

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut()
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
