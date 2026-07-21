import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import MCHero from "@/components/sections/masterclass/MCHero"
import MCBenefits from "@/components/sections/masterclass/MCBenefits"
import MCRegistrationForm from "@/components/sections/masterclass/MCRegistrationForm"
import MCFAQ from "@/components/sections/masterclass/MCFAQ"
import MCSpeaker from "@/components/sections/masterclass/MCSpeaker"
import MCFooter from "@/components/sections/masterclass/MCFooter"
import MCStickyCTA from "@/components/sections/masterclass/MCStickyCTA"

export default function MasterclassPage() {
  const { status, isAccessible, reason } = useLandingStatus("/masterclass")

  useEffect(() => {
    document.title = "Masterclass Gratis: Paso Cero EB2-NIW — MORE"

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
      "Masterclass gratuita con Ivon More. Descubre el primer paso para migrar a EE.UU. con la visa EB2-NIW para profesionales. 25 de mayo 2026, 7 PM Colombia."
    )
    setMeta(
      "property",
      "og:title",
      "Masterclass Gratis: Paso Cero EB2-NIW"
    )
    setMeta(
      "property",
      "og:description",
      "Una clase que puede cambiar tu futuro. Aprende el primer paso para migrar a EE.UU. como profesional. 25 de mayo 2026, 7 PM Colombia."
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
      <MCHero />
      <MCBenefits />
      <MCRegistrationForm />
      <MCFAQ />
      <MCSpeaker />
      <MCFooter />
      <MCStickyCTA />
    </div>
  )
}
