import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import WEHero from "@/components/sections/webinar-estatus/WEHero"
import WEBenefits from "@/components/sections/webinar-estatus/WEBenefits"
import WETension from "@/components/sections/webinar-estatus/WETension"
import WETestimonials from "@/components/sections/webinar-estatus/WETestimonials"
import WERegistrationForm from "@/components/sections/webinar-estatus/WERegistrationForm"
import WEFAQ from "@/components/sections/webinar-estatus/WEFAQ"
import WESpeaker from "@/components/sections/webinar-estatus/WESpeaker"
import WEFooter from "@/components/sections/webinar-estatus/WEFooter"
import WEStickyCTA from "@/components/sections/webinar-estatus/WEStickyCTA"

export default function WebinarEstatusPage() {
  const { status, isAccessible, reason } = useLandingStatus("/webinar-estatus")

  useEffect(() => {
    document.title =
      "Webinar Gratis: ¿Cuál es tu estatus, de verdad? — MORE"

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
      "Webinar gratuito con Ivon More. Aprende a leer tu I-94, entender visa vs estatus y dejar de adivinar tu situación migratoria."
    )
    setMeta(
      "property",
      "og:title",
      "¿Cuál es tu estatus, de verdad?"
    )
    setMeta(
      "property",
      "og:description",
      "No necesitas memorizar todas las visas. Necesitas aprender a leer tu propia historia migratoria. Webinar en vivo."
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
      <WEHero />
      <WEBenefits />
      <WETension />
      <WETestimonials />
      <WERegistrationForm />
      <WEFAQ />
      <WESpeaker />
      <WEFooter />
      <WEStickyCTA />
    </div>
  )
}
