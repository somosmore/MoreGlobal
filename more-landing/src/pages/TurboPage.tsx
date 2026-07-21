import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { buildWhatsappUrl } from "@/lib/whatsapp"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { TurboHero } from "@/turbo/components/TurboHero"
import { TurboRequirementsSection } from "@/turbo/components/TurboRequirementsSection"
import { TurboIncludesSection } from "@/turbo/components/TurboIncludesSection"
import { TurboProcessSection } from "@/turbo/components/TurboProcessSection"
import { TurboCommitmentsSection } from "@/turbo/components/TurboCommitmentsSection"
import { TurboIvonSection } from "@/turbo/components/TurboIvonSection"
import { TurboTestimonialsSection } from "@/turbo/components/TurboTestimonialsSection"
import { TurboPricingSection } from "@/turbo/components/TurboPricingSection"
import { TurboFaq } from "@/turbo/components/TurboFaq"
import { TurboStickyCta } from "@/turbo/components/TurboStickyCta"
import { TurboCtaButtons } from "@/turbo/components/TurboCtaButtons"

export default function TurboPage() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()
  const paymentLink = settings.turbo_payment_link
  const price = settings.turbo_price
  const countdownDate = settings.turbo_countdown_date
  const whatsappUrl = buildWhatsappUrl(settings.whatsapp_number, t("turboPage.cta.whatsappMsg"))

  useEffect(() => {
    document.title = t("turboPage.pageTitle")

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

    setMeta("name", "description", t("turboPage.meta.description"))
    setMeta("property", "og:title", t("turboPage.meta.ogTitle"))
    setMeta("property", "og:description", t("turboPage.meta.ogDescription"))
    setMeta("property", "og:type", "website")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [t])

  return (
    <div className="campaign-editorial min-h-screen bg-paper">
      <Navbar />
      <main className="flex flex-col gap-0">
        <TurboHero
          paymentLink={paymentLink}
          price={price}
          countdownDate={countdownDate}
          whatsappUrl={whatsappUrl}
          loading={loading}
        />
        <section className="bg-paper-warm py-16 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
            <div id="turbo-requisitos">
              <TurboRequirementsSection />
            </div>

            <div id="turbo-incluye">
              <TurboIncludesSection />
            </div>

            <TurboProcessSection />

            <TurboCommitmentsSection />

            <TurboIvonSection />

            <TurboTestimonialsSection />

            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-navy/15 bg-white px-6 py-8 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange mb-1">
                ¿Listo para comenzar?
              </p>
              <p className="text-xl font-bold text-navy mb-5">
                Reserva tu lugar en el Plan Turbo hoy
              </p>
              <TurboCtaButtons
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
                layout="row"
                showGuarantee
                theme="light"
              />
            </div>

            <TurboPricingSection
              paymentLink={paymentLink}
              price={price}
              whatsappUrl={whatsappUrl}
              countdownDate={countdownDate}
              loading={loading}
            />

            <div id="turbo-faq">
              <TurboFaq
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer hideLandingFaq />
      <TurboStickyCta paymentLink={paymentLink} price={price} loading={loading} />
    </div>
  )
}
