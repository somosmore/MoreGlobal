import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { VipHero } from "@/vip/components/VipHero"
import { VipSessionIncluded } from "@/vip/components/VipSessionIncluded"
import { VipValueSection } from "@/vip/components/VipValueSection"
import { VipAboutIvon } from "@/vip/components/VipAboutIvon"
import { VipFitSection } from "@/vip/components/VipFitSection"
import { VipSocialProofSection } from "@/vip/components/VipSocialProofSection"
import { VipPricingSection } from "@/vip/components/VipPricingSection"
import { VipFaq } from "@/vip/components/VipFaq"

export default function VipSessionPage() {
  const { settings, loading } = useSiteSettings()
  const calendarUrl = settings.calendar_url
  const vipPaymentLink = settings.vip_payment_link
  const vipPrice = settings.vip_price

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col gap-0">
        <VipHero calendarUrl={calendarUrl} vipPaymentLink={vipPaymentLink} vipPrice={vipPrice} loading={loading} />
        <section className="bg-white py-32 sm:py-32">
          <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
            <VipSessionIncluded />
            <VipSocialProofSection />
            <VipValueSection />
            <VipAboutIvon />
            <VipFitSection />
            <VipPricingSection calendarUrl={calendarUrl} vipPaymentLink={vipPaymentLink} vipPrice={vipPrice} loading={loading} />
            <VipFaq calendarUrl={calendarUrl} vipPaymentLink={vipPaymentLink} loading={loading} />
          </div>
        </section>
      </main>
      <Footer hideLandingFaq />
    </div>
  )
}

