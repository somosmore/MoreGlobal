import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import WSHero from "@/components/sections/webinar-sep-26/WSHero"
import WSBenefits from "@/components/sections/webinar-sep-26/WSBenefits"
import WSTension from "@/components/sections/webinar-sep-26/WSTension"
import WSRoadmap from "@/components/sections/webinar-sep-26/WSRoadmap"
import WSTestimonials from "@/components/sections/webinar-sep-26/WSTestimonials"
import WSRegistrationForm from "@/components/sections/webinar-sep-26/WSRegistrationForm"
import WSFAQ from "@/components/sections/webinar-sep-26/WSFAQ"
import WSSpeaker from "@/components/sections/webinar-sep-26/WSSpeaker"
import WSFooter from "@/components/sections/webinar-sep-26/WSFooter"
import WSStickyCTA from "@/components/sections/webinar-sep-26/WSStickyCTA"

export default function WebinarSep26Page() {
  const { status, isAccessible, reason } = useLandingStatus("/webinar-sep-26")

  useEffect(() => {
    document.title =
      "Masterclass Gratis: El nuevo panorama migratorio de EE.UU. — Instituto More"

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

    setMeta(
      "name",
      "description",
      "Masterclass 1 del Instituto More con Ivon More. Jueves 3 de septiembre, 7:00 PM Colombia. Entiende qué cambió en el panorama migratorio de Estados Unidos antes de decidir."
    )
    setMeta(
      "property",
      "og:title",
      "El nuevo panorama migratorio de Estados Unidos"
    )
    setMeta(
      "property",
      "og:description",
      "Masterclass 1 del Instituto More de Educación Migratoria. En vivo y gratis, jueves 3 de septiembre a las 7:00 PM (hora Colombia)."
    )
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
      <WSHero />
      <WSBenefits />
      <WSTension />
      <WSRoadmap />
      <WSTestimonials />
      <WSRegistrationForm />
      <WSFAQ />
      <WSSpeaker />
      <WSFooter />
      <WSStickyCTA />
    </div>
  )
}
