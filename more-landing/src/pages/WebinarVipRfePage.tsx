import { useEffect } from "react"
import { useLandingStatus } from "@/hooks/useLandingStatus"
import { CtaButton } from "@/components/brand/CtaButton"
import BrandLoader from "@/components/brand/BrandLoader"
import WVHero from "@/components/sections/webinar-vip-rfe/WVHero"
import WVAgenda from "@/components/sections/webinar-vip-rfe/WVAgenda"
import WVRegistrationForm from "@/components/sections/webinar-vip-rfe/WVRegistrationForm"
import { WVFAQ, WVFooter, WVSpeaker } from "@/components/sections/webinar-vip-rfe/WVClosing"
import { WV_PAGE_META, WV_ROUTE } from "@/components/sections/webinar-vip-rfe/webinarVipRfeCopy"

/** Webinar VIP (solo miembros VIP, entrada paga). No se indexa: se comparte por correo y WhatsApp. */
export default function WebinarVipRfePage() {
  const { status, isAccessible, reason } = useLandingStatus(WV_ROUTE)

  useEffect(() => {
    document.title = WV_PAGE_META.title
    const creadas: HTMLMetaElement[] = []
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute(attr, key)
        document.head.appendChild(el)
        creadas.push(el)
      }
      el.setAttribute("content", content)
    }
    setMeta("name", "description", WV_PAGE_META.description)
    setMeta("property", "og:title", WV_PAGE_META.title)
    setMeta("property", "og:description", WV_PAGE_META.description)
    setMeta("name", "robots", "noindex, nofollow")
    return () => creadas.forEach((el) => el.remove())
  }, [])

  if (status === "loading") return <BrandLoader tone="dark" label="Preparando el webinar…" />

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
      <WVHero />
      <WVAgenda />
      <WVRegistrationForm />
      <WVFAQ />
      <WVSpeaker />
      <WVFooter />
    </div>
  )
}
