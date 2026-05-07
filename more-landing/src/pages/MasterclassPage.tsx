import { useEffect } from "react"
import MCHero from "@/components/sections/masterclass/MCHero"
import MCBenefits from "@/components/sections/masterclass/MCBenefits"
import MCRegistrationForm from "@/components/sections/masterclass/MCRegistrationForm"
import MCSpeaker from "@/components/sections/masterclass/MCSpeaker"
import MCFooter from "@/components/sections/masterclass/MCFooter"

export default function MasterclassPage() {
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
      "Masterclass gratuita de 3 días con Ivon More. Descubre el primer paso para migrar a EE.UU. con la visa EB2-NIW para profesionales. 25, 26 y 27 de mayo 2026."
    )
    setMeta(
      "property",
      "og:title",
      "Masterclass Gratis: Paso Cero EB2-NIW"
    )
    setMeta(
      "property",
      "og:description",
      "3 días que pueden cambiar tu futuro. Aprende el primer paso para migrar a EE.UU. como profesional. 25-27 mayo 2026, 7 PM Colombia."
    )
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <MCHero />
      <MCBenefits />
      <MCRegistrationForm />
      <MCSpeaker />
      <MCFooter />
    </div>
  )
}
