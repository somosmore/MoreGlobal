import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import {
  buildWhatsappUrlFromPhone,
  pickRandomUrl,
} from "@/lib/wppEquipo"

type PageState = "loading" | "redirecting" | "unavailable"

export default function WppEquipoPage() {
  const { settings, loading: settingsLoading } = useSiteSettings()
  const [pageState, setPageState] = useState<PageState>("loading")
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const handleRedirect = (target: string) => {
    setRedirectTarget(target)
    setPageState("redirecting")
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      window.location.replace(target)
    }, 400)
  }

  useEffect(() => {
    document.title = "Conectando con el Equipo More…"

    const description = "Te estamos conectando con el equipo de More por WhatsApp."
    let metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const createdMeta = !metaDescription
    if (!metaDescription) {
      metaDescription = document.createElement("meta")
      metaDescription.setAttribute("name", "description")
      document.head.appendChild(metaDescription)
    }
    const previousDescription = metaDescription.getAttribute("content")
    metaDescription.setAttribute("content", description)

    let metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const createdRobots = !metaRobots
    if (!metaRobots) {
      metaRobots = document.createElement("meta")
      metaRobots.setAttribute("name", "robots")
      document.head.appendChild(metaRobots)
    }
    const previousRobots = metaRobots.getAttribute("content")
    metaRobots.setAttribute("content", "noindex, nofollow")

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      if (createdMeta) {
        metaDescription?.remove()
      } else if (previousDescription !== null) {
        metaDescription?.setAttribute("content", previousDescription)
      }
      if (createdRobots) {
        metaRobots?.remove()
      } else if (previousRobots !== null) {
        metaRobots?.setAttribute("content", previousRobots)
      }
    }
  }, [])

  useEffect(() => {
    if (settingsLoading) return

    let cancelled = false

    const resolveAndRedirect = async () => {
      const fallbackUrl = buildWhatsappUrlFromPhone(settings.whatsapp_number)
      const pageEnabled = settings.wppequipo_enabled.trim().toLowerCase() !== "false"

      if (!pageEnabled) {
        if (fallbackUrl) {
          if (!cancelled) handleRedirect(fallbackUrl)
          return
        }
        if (!cancelled) setPageState("unavailable")
        return
      }

      if (!supabase) {
        if (fallbackUrl) {
          if (!cancelled) handleRedirect(fallbackUrl)
          return
        }
        if (!cancelled) setPageState("unavailable")
        return
      }

      const { data, error } = await supabase
        .from("wpp_team_numbers")
        .select("url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (cancelled) return

      if (error) {
        if (fallbackUrl) {
          handleRedirect(fallbackUrl)
          return
        }
        setPageState("unavailable")
        return
      }

      const urls = (data ?? []).map((row) => row.url as string).filter(Boolean)
      const target = pickRandomUrl(urls) ?? fallbackUrl

      if (target) {
        handleRedirect(target)
        return
      }

      setPageState("unavailable")
    }

    resolveAndRedirect()

    return () => {
      cancelled = true
    }
  }, [settingsLoading, settings.wppequipo_enabled, settings.whatsapp_number])

  const handleManualOpen = () => {
    if (redirectTarget) {
      window.location.replace(redirectTarget)
      return
    }
    const fallback = buildWhatsappUrlFromPhone(settings.whatsapp_number)
    if (fallback) window.location.replace(fallback)
  }

  if (pageState === "unavailable") {
    return (
      <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#0b1f17] via-[#0f2a20] to-[#1a3a2c] px-6 text-center text-white">
        <div className="relative z-10 flex max-w-md flex-col items-center gap-6">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Equipo no disponible por WhatsApp
          </h1>
          <p className="text-base text-white/70">
            En este momento no podemos conectarte por este canal. Volvé a intentar más tarde o visitá nuestra página principal.
          </p>
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#1ebe57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Ir a la página principal
          </a>
        </div>
      </main>
    )
  }

  return (
    <main
      role="status"
      aria-live="polite"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-[#0b1f17] via-[#0f2a20] to-[#1a3a2c] px-6 text-center text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(37,211,102,0.25), transparent 45%), radial-gradient(circle at 80% 70%, rgba(18,140,126,0.25), transparent 50%)",
        }}
      />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-8">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-25" />
          <span className="absolute inline-flex h-16 w-16 animate-pulse rounded-full bg-[#25D366]/30" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-2xl">
            <svg
              viewBox="0 0 32 32"
              className="h-7 w-7 fill-white"
              aria-hidden="true"
            >
              <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.247v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.41 3.41 4.404 4.5.616.33 2.853 1.175 3.54 1.175.674 0 2.337-.66 2.594-1.32.13-.328.18-.62.18-1.005 0-.214-.045-.415-.157-.575-.244-.385-2.41-1.534-2.81-1.534zM16.04 3.7c-6.85 0-12.41 5.557-12.41 12.41 0 2.34.659 4.55 1.84 6.42L3.7 28.32l6.025-1.605a12.34 12.34 0 0 0 6.32 1.737c6.85 0 12.41-5.55 12.41-12.41 0-3.318-1.296-6.43-3.638-8.78a12.41 12.41 0 0 0-8.778-3.658zm0 22.737a10.33 10.33 0 0 1-5.554-1.62l-.395-.246-3.692.985.99-3.61-.26-.404a10.32 10.32 0 0 1-1.65-5.595c0-5.713 4.65-10.346 10.36-10.346a10.27 10.27 0 0 1 7.32 3.04 10.27 10.27 0 0 1 3.026 7.305c0 5.713-4.65 10.49-10.346 10.49z" />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Conectando con el Equipo More
          </h1>
          <p className="text-balance text-base text-white/70 sm:text-lg">
            Estamos abriendo WhatsApp en este instante. Aguardá un momento…
          </p>
        </div>

        <button
          type="button"
          onClick={handleManualOpen}
          className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur transition-all duration-200 hover:bg-white/15 hover:ring-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          ¿No abrió solo? Tocá acá para continuar
        </button>
      </div>
    </main>
  )
}
