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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
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
          <CtaButton label="Ir al inicio" to="/" icon={null} className="w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
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
