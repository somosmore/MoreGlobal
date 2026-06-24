import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
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
      "Taller gratuito con Ivon More. Las señales de alerta que debes detectar antes de pagarle a un abogado de inmigración. Martes 30 de junio 2026, 7 PM Colombia."
    )
    setMeta(
      "property",
      "og:title",
      "Red flags de los abogados de inmigración — te lo confiesa una abogada"
    )
    setMeta(
      "property",
      "og:description",
      "Un taller en vivo que te puede ahorrar miles de dólares. Aprende a detectar a un mal abogado antes de pagarle. Martes 30 de junio 2026, 7 PM Colombia."
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
    <div className="min-h-screen bg-white">
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
