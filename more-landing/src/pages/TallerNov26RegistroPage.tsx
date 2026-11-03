import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import TCPaymentCard from "@/components/sections/taller-nov-26/TCPaymentCard"
import { TALLER_REGISTRO_PAGE_META } from "@/components/sections/taller-nov-26/tallerNov26Copy"
import { Backdrop } from "@/components/brand/Backdrop"
import { CtaButton } from "@/components/brand/CtaButton"

/** Post-registro para Meta Lead Ads: el lead ya dejó sus datos, aquí elige y paga su entrada. */
export default function TallerNov26RegistroPage() {
  const { status, isAccessible, reason } = useLandingStatus("/taller-nov-26")

  useEffect(() => {
    document.title = TALLER_REGISTRO_PAGE_META.title

    const metas: HTMLMetaElement[] = []

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        metas.push(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("name", "description", TALLER_REGISTRO_PAGE_META.description)
    setMeta("property", "og:title", TALLER_REGISTRO_PAGE_META.ogTitle)
    setMeta("property", "og:description", TALLER_REGISTRO_PAGE_META.ogDescription)
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
      document.title = "MORE | Visa EB-2 NIW — Tu camino hacia la Green Card"
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!isAccessible) {
    return (
      <div className="campaign-editorial relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-paper px-4">
        <Backdrop variant="hero" className="opacity-70" />
        <div className="relative z-10 max-w-md text-center">
          <img src="/logo_more_dark.png" alt="MORE" className="mx-auto mb-8 h-48 w-auto sm:h-60" />
          <h1 className="mb-3 font-display text-2xl font-bold text-navy-deep">Evento no disponible</h1>
          <p className="mb-8 font-sans text-sm text-ink-muted">{reason}</p>
          <CtaButton label="Ir al inicio" to="/" icon={null} className="w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="campaign-editorial relative flex min-h-[100dvh] flex-col overflow-hidden bg-paper">
      <Backdrop variant="hero" className="opacity-60" />
      <main className="relative z-10 flex flex-1 flex-col justify-center px-4 py-10 sm:py-14">
        <TCPaymentCard showLogo />
        <p className="relative z-10 mt-8 text-center font-sans text-xs text-ink-muted">
          <Link
            to="/taller-nov-26"
            className="rounded-sm underline-offset-4 transition-colors hover:text-navy hover:underline"
          >
            Ver el detalle del taller
          </Link>
        </p>
      </main>
    </div>
  )
}
