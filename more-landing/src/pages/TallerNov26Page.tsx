import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import TCHero from "@/components/sections/taller-nov-26/TCHero"
import TCPains from "@/components/sections/taller-nov-26/TCPains"
import TCManifesto from "@/components/sections/taller-nov-26/TCManifesto"
import TCModules from "@/components/sections/taller-nov-26/TCModules"
import TCAudience from "@/components/sections/taller-nov-26/TCAudience"
import TCTestimonials from "@/components/sections/taller-nov-26/TCTestimonials"
import TCTickets from "@/components/sections/taller-nov-26/TCTickets"
import TCRegistrationForm from "@/components/sections/taller-nov-26/TCRegistrationForm"
import TCFAQ from "@/components/sections/taller-nov-26/TCFAQ"
import TCSpeaker from "@/components/sections/taller-nov-26/TCSpeaker"
import TCFinalCTA from "@/components/sections/taller-nov-26/TCFinalCTA"
import TCFooter from "@/components/sections/taller-nov-26/TCFooter"
import TCStickyCTA from "@/components/sections/taller-nov-26/TCStickyCTA"
import { TALLER_PAGE_META } from "@/components/sections/taller-nov-26/tallerNov26Copy"

export default function TallerNov26Page() {
  const { status, isAccessible, reason } = useLandingStatus("/taller-nov-26")

  useEffect(() => {
    document.title = TALLER_PAGE_META.title

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

    setMeta("name", "description", TALLER_PAGE_META.description)
    setMeta("property", "og:title", TALLER_PAGE_META.ogTitle)
    setMeta("property", "og:description", TALLER_PAGE_META.ogDescription)
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    )
  }

  if (!isAccessible) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="max-w-md text-center">
          <img src="/logo_more_light.png" alt="MORE" className="mx-auto mb-8 h-20" />
          <h1 className="mb-3 text-2xl font-bold text-navy-deep">Evento no disponible</h1>
          <p className="mb-8 text-ink-muted">{reason}</p>
          <CtaButton label="Ir al inicio" to="/" icon={null} className="w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="campaign-editorial min-h-screen bg-paper">
      <TCHero />
      <TCPains />
      <TCManifesto />
      <TCModules />
      <TCAudience />
      <TCTestimonials />
      <TCTickets />
      <TCRegistrationForm />
      <TCFAQ />
      <TCSpeaker />
      <TCFinalCTA />
      <TCFooter />
      <TCStickyCTA />
    </div>
  )
}
