import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { VipHero } from "@/vip/components/VipHero"
import { VipWhySection } from "@/vip/components/VipWhySection"
import { VipReceiveSection } from "@/vip/components/VipReceiveSection"
import { VipAboutIvon } from "@/vip/components/VipAboutIvon"
import { VipFitSection } from "@/vip/components/VipFitSection"
import { VipPricingSection } from "@/vip/components/VipPricingSection"
import { VipFaq } from "@/vip/components/VipFaq"
import { VipBackdrop } from "@/vip/components/VipBackdrop"
import { VipOfferClosed } from "@/vip/components/VipOfferClosed"
import { useVipOffer } from "@/vip/hooks/useVipOffer"

const DEFAULT_PAYMENT_LINK = "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"
const DEFAULT_PRICE = "$97"

export default function VipSessionPage() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()

  const paymentLink = settings.vip_payment_link || settings.calendar_url || DEFAULT_PAYMENT_LINK
  const price = settings.vip_price || DEFAULT_PRICE
  const { expired, timeLeft } = useVipOffer(settings.vip_countdown_date)

  useEffect(() => {
    document.title = t("vipPage.pageTitle")
    return () => {
      document.title = t("blueprint.defaultTitle")
    }
  }, [t])

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      {!loading && expired ? (
        <main>
          <VipOfferClosed whatsappNumber={settings.whatsapp_number} />
        </main>
      ) : (
        <main className="flex flex-col">
          <VipHero
            paymentLink={paymentLink}
            price={price}
            loading={loading}
            timeLeft={timeLeft}
          />

          <section className="relative overflow-hidden py-20 sm:py-24">
            <VipBackdrop variant="section" />
            <div className="relative mx-auto flex max-w-6xl flex-col gap-24 px-4 sm:px-6 lg:px-8">
              <VipWhySection />
              <VipReceiveSection paymentLink={paymentLink} price={price} loading={loading} />
              <VipAboutIvon />
              <VipFitSection />
              <VipPricingSection
                paymentLink={paymentLink}
                price={price}
                loading={loading}
                timeLeft={timeLeft}
              />
              <VipFaq paymentLink={paymentLink} loading={loading} />
            </div>
          </section>
        </main>
      )}

      <Footer hideLandingFaq />
    </div>
  )
}
