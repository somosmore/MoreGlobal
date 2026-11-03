import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import BrandLoader from "@/components/brand/BrandLoader"
import TCHero from "@/components/sections/taller-nov-26/TCHero"
import TCPains from "@/components/sections/taller-nov-26/TCPains"
import TCModules from "@/components/sections/taller-nov-26/TCModules"
import TCAudience from "@/components/sections/taller-nov-26/TCAudience"
import TCFears from "@/components/sections/taller-nov-26/TCFears"
import TCTestimonials from "@/components/sections/taller-nov-26/TCTestimonials"
import TCTickets from "@/components/sections/taller-nov-26/TCTickets"
import TCRegistrationForm from "@/components/sections/taller-nov-26/TCRegistrationForm"
import TCFAQ from "@/components/sections/taller-nov-26/TCFAQ"
import TCSpeaker from "@/components/sections/taller-nov-26/TCSpeaker"
import TCFinalCTA from "@/components/sections/taller-nov-26/TCFinalCTA"
import TCFooter from "@/components/sections/taller-nov-26/TCFooter"
import TCStickyCTA from "@/components/sections/taller-nov-26/TCStickyCTA"
import { TALLER_PAGE_META, type PriceTier } from "@/components/sections/taller-nov-26/tallerNov26Copy"
import { PriceTierContext } from "@/components/sections/taller-nov-26/priceTier"

type TallerNov26PageProps = {
  /** `comunidad` = /taller-23nov/comunidad: precio exclusivo, no indexable. */
  tier?: PriceTier
}

export default function TallerNov26Page({ tier = "publico" }: TallerNov26PageProps) {
  const { status, isAccessible, reason } = useLandingStatus("/taller-23nov")

  useEffect(() => {
    document.title =
      tier === "comunidad" ? `Precio Comunidad More · ${TALLER_PAGE_META.title}` : TALLER_PAGE_META.title

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
    // La versión con precio de comunidad no debe aparecer en buscadores.
    if (tier === "comunidad") setMeta("name", "robots", "noindex, nofollow")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [tier])

  if (status === "loading") {
    return <BrandLoader tone="dark" label="Preparando tu ruta…" />
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
    <PriceTierContext.Provider value={tier}>
      <div className="campaign-editorial min-h-screen bg-paper">
        <TCHero />
        <TCPains />
        <TCModules />
        <TCAudience />
        <TCFears />
        <TCTestimonials />
        <TCTickets />
        <TCRegistrationForm />
        <TCFAQ />
        <TCSpeaker />
        <TCFinalCTA />
        <TCFooter />
        <TCStickyCTA />
      </div>
    </PriceTierContext.Provider>
  )
}
