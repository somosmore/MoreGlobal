import { useAuth } from "@/contexts/AuthContext"
import type { UserRole } from "@/lib/supabase"

export const useUserRole = (): UserRole | null => {
  const { role } = useAuth()
  return role
}

export const useIsRoot = (): boolean => {
  const { role } = useAuth()
  return role === "root"
}
