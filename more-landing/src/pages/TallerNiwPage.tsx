import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import TNHero from "@/components/sections/taller-niw/TNHero"
import TNBenefits from "@/components/sections/taller-niw/TNBenefits"
import TNTestimonials from "@/components/sections/taller-niw/TNTestimonials"
import TNRegistrationForm from "@/components/sections/taller-niw/TNRegistrationForm"
import TNFAQ from "@/components/sections/taller-niw/TNFAQ"
import TNSpeaker from "@/components/sections/taller-niw/TNSpeaker"
import TNFooter from "@/components/sections/taller-niw/TNFooter"
import TNStickyCTA from "@/components/sections/taller-niw/TNStickyCTA"

export default function TallerNiwPage() {
  const { status, isAccessible, reason } = useLandingStatus("/taller-niw")

  useEffect(() => {
    document.title = "Taller Gratis: Red flags de los abogados de inmigración — MORE"

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
      "Taller gratuito con Ivon More. Las señales de alerta que debes detectar antes de pagarle a un abogado de inmigración. Lunes 13 de julio 2026, 7 PM Colombia."
    )
    setMeta(
      "property",
      "og:title",
      "Red flags de los abogados de inmigración — te lo confiesa una abogada"
    )
    setMeta(
      "property",
      "og:description",
      "Un taller en vivo que te puede ahorrar miles de dólares. Aprende a detectar a un mal abogado antes de pagarle. Lunes 13 de julio 2026, 7 PM Colombia."
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
      <TNHero />
      <TNBenefits />
      <TNTestimonials />
      <TNRegistrationForm />
      <TNFAQ />
      <TNSpeaker />
      <TNFooter />
      <TNStickyCTA />
    </div>
  )
}
