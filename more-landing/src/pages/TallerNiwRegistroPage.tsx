import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import TNRegistrationForm from "@/components/sections/taller-niw/TNRegistrationForm"
import {
  TALLER_NIW_REGISTRO_HEADER,
  TALLER_NIW_REGISTRO_PAGE_META,
} from "@/components/sections/taller-niw/tallerNiwCopy"

export default function TallerNiwRegistroPage() {
  const { status, isAccessible, reason } = useLandingStatus("/taller-niw")

  useEffect(() => {
    document.title = TALLER_NIW_REGISTRO_PAGE_META.title

    const metas: HTMLMetaElement[] = []

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[${attr}="${key}"]`
      )
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        metas.push(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("name", "description", TALLER_NIW_REGISTRO_PAGE_META.description)
    setMeta("property", "og:title", TALLER_NIW_REGISTRO_PAGE_META.ogTitle)
    setMeta(
      "property",
      "og:description",
      TALLER_NIW_REGISTRO_PAGE_META.ogDescription
    )
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#001A52] via-[#0033A0] to-[#001233]">
        <div className="w-8 h-8 border-4 border-[#F37021] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAccessible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0033A0] to-[#001A52] px-4">
        <div className="text-center max-w-md">
          <img src="/logo_more_dark.png" alt="MORE" className="h-20 mx-auto mb-8 opacity-80" />
          <h1 className="text-2xl font-bold text-white mb-3">Evento no disponible</h1>
          <p className="text-white/60 mb-8">{reason}</p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#F37021] rounded-lg hover:bg-[#D4611A] transition-colors"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#001A52] via-[#0033A0] to-[#001233]">
      <header className="relative z-10 px-4 pt-8 pb-2 text-center">
        <img
          src="/logo_more_dark.png"
          alt="MORE"
          className="h-12 sm:h-14 mx-auto mb-4"
        />
        <p className="text-sm text-white/70 max-w-md mx-auto">
          {TALLER_NIW_REGISTRO_HEADER}
        </p>
      </header>

      <main className="flex-1">
        <TNRegistrationForm variant="ads" />
      </main>

      <footer className="relative z-10 px-4 py-6 text-center text-xs text-white/40">
        <p>
          © 2026 MORE ·{" "}
          <Link
            to="/privacidad"
            className="underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Política de privacidad
          </Link>
        </p>
      </footer>
    </div>
  )
}
