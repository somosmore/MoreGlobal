import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import CMHero from "@/components/sections/comunidad/CMHero"
import CMBenefits from "@/components/sections/comunidad/CMBenefits"
import CMProof from "@/components/sections/comunidad/CMProof"
import CMRegistrationForm from "@/components/sections/comunidad/CMRegistrationForm"
import CMFAQ from "@/components/sections/comunidad/CMFAQ"
import CMSpeaker from "@/components/sections/comunidad/CMSpeaker"
import CMStickyCTA from "@/components/sections/comunidad/CMStickyCTA"
import { COMUNIDAD_PAGE_META } from "@/components/sections/comunidad/comunidadCopy"
import WSTestimonials from "@/components/sections/webinar-sep-26/WSTestimonials"
import WSFooter from "@/components/sections/webinar-sep-26/WSFooter"

export default function ComunidadPage() {
  const { status, isAccessible, reason } = useLandingStatus("/comunidad")

  useEffect(() => {
    document.title = COMUNIDAD_PAGE_META.title

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

    setMeta("name", "description", COMUNIDAD_PAGE_META.description)
    setMeta("property", "og:title", COMUNIDAD_PAGE_META.ogTitle)
    setMeta("property", "og:description", COMUNIDAD_PAGE_META.ogDescription)
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
          <h1 className="mb-3 text-2xl font-bold text-navy-deep">Página no disponible</h1>
          <p className="mb-8 text-ink-muted">{reason}</p>
          <CtaButton label="Ir al inicio" to="/" icon={null} className="w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="campaign-editorial min-h-screen bg-paper">
      <CMHero />
      <CMBenefits />
      <CMProof />
      <WSTestimonials />
      <CMRegistrationForm />
      <CMFAQ />
      <CMSpeaker />
      <WSFooter />
      <CMStickyCTA />
    </div>
  )
}
