import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { UppHero } from "@/upp/components/UppHero"
import { UppCtaButtons } from "@/upp/components/UppCtaButtons"
import { UppAudienceSection } from "@/upp/components/UppAudienceSection"
import { UppProblemSection } from "@/upp/components/UppProblemSection"
import { UppSolutionSection } from "@/upp/components/UppSolutionSection"
import { UppBenefitsSection } from "@/upp/components/UppBenefitsSection"
import { UppModulesSection } from "@/upp/components/UppModulesSection"
import { UppTestimonialsSection } from "@/upp/components/UppTestimonialsSection"
import { UppValueStackSection } from "@/upp/components/UppValueStackSection"
import { UppBonusStackSection } from "@/upp/components/UppBonusStackSection"
import { UppPricingSection } from "@/upp/components/UppPricingSection"
import { UppPlansSection } from "@/upp/components/UppPlansSection"
import { UppFaq } from "@/upp/components/UppFaq"
import { UppStickyCta } from "@/upp/components/UppStickyCta"

export default function UppPage() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()
  const paymentLink = settings.upp_payment_link
  const price = settings.upp_price
  const countdownDate = settings.upp_countdown_date
  const whatsappUrl = t("uppPage.cta.whatsappUrl")

  useEffect(() => {
    document.title = t("uppPage.pageTitle")

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

    setMeta("name", "description", t("uppPage.meta.description"))
    setMeta("property", "og:title", t("uppPage.meta.ogTitle"))
    setMeta("property", "og:description", t("uppPage.meta.ogDescription"))
    setMeta("property", "og:type", "website")
    setMeta("property", "og:image", "/upp/portada-upp.png")

    return () => {
      metas.forEach((el) => el.remove())
    }
  }, [t])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col gap-0">
        <UppHero
          paymentLink={paymentLink}
          price={price}
          countdownDate={countdownDate}
          whatsappUrl={whatsappUrl}
          loading={loading}
        />
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
            <div id="upp-audiencia"><UppAudienceSection /></div>
            <UppProblemSection />
            <UppSolutionSection />
            <UppBenefitsSection />
            <div id="upp-modulos"><UppModulesSection /></div>
            <UppTestimonialsSection />
            <div className="mx-auto max-w-2xl w-full rounded-2xl bg-[#0A3161]/5 border border-[#0A3161]/10 px-6 py-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-orange mb-1">¿Ya estás convencido?</p>
              <p className="text-xl font-bold text-navy mb-5">Empieza tu ruta a la Green Card hoy</p>
              <UppCtaButtons
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
                layout="row"
                showGuarantee
                theme="light"
              />
            </div>
            <UppValueStackSection price={price} loading={loading} />
            <UppBonusStackSection price={price} loading={loading} />
            <UppPricingSection
              paymentLink={paymentLink}
              price={price}
              whatsappUrl={whatsappUrl}
              countdownDate={countdownDate}
              loading={loading}
            />
            <div id="upp-planes">
              <UppPlansSection
                paymentLink={paymentLink}
                price={price}
                whatsappUrl={whatsappUrl}
                loading={loading}
              />
            </div>
            <div id="upp-faq">
              <UppFaq
                paymentLink={paymentLink}
                whatsappUrl={whatsappUrl}
                loading={loading}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer hideLandingFaq />
      <UppStickyCta paymentLink={paymentLink} price={price} loading={loading} />
    </div>
  )
}
