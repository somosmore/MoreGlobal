import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { bootstrapTracking } from "@/lib/tracking"

export const TrackingBootstrap = () => {
  const { pathname } = useLocation()
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    if (loading) return
    void bootstrapTracking(pathname, settings)
  }, [loading, pathname, settings])

  return null
}
