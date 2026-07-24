import { useEffect } from "react"
import { Link } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Backdrop } from "@/components/brand/Backdrop"
import { CtaButton } from "@/components/brand/CtaButton"
import { ThankYouHero } from "@/components/thank-you/ThankYouHero"
import { ThankYouChecklist } from "@/components/thank-you/ThankYouChecklist"
import { ThankYouSession } from "@/components/thank-you/ThankYouSession"
import { ThankYouProof } from "@/components/thank-you/ThankYouProof"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { buildWhatsappUrl } from "@/lib/whatsapp"
import { trackAppointmentBooked } from "@/lib/tracking"

const SUPPORT_EMAIL = "soporte@moremigracion.com"

export default function ThankYouPage() {
  const { t } = useTranslation()
  const { settings, loading } = useSiteSettings()

  const whatsappUrl = buildWhatsappUrl(
    settings.whatsapp_number,
    t("thankYouPage.cta.whatsappMsg"),
  )

  useEffect(() => {
    document.title = t("thankYouPage.pageTitle")
    return () => {
      document.title = "MORE"
    }
  }, [t])

  useEffect(() => {
    if (loading) return
    void trackAppointmentBooked(settings)
  }, [loading, settings])

  return (
    <div className="campaign-editorial min-h-screen bg-paper">
      <header className="relative z-10 border-b border-navy/10 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-36 max-w-4xl items-center justify-center px-4 sm:h-44 sm:px-6">
          <Link
            to="/"
            className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-sm"
            aria-label={t("thankYouPage.header.homeAria")}
          >
            <img
              src="/logo_more_light.png"
              alt={t("thankYouPage.header.logoAlt")}
              className="h-32 w-auto sm:h-40"
            />
          </Link>
        </div>
      </header>

      <main>
        <ThankYouHero />

        <section className="relative overflow-hidden py-16 sm:py-20">
          <Backdrop variant="section" />
          <div className="relative mx-auto flex max-w-4xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
            <ThankYouChecklist />
            <ThankYouSession />
            <ThankYouProof />

            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 text-center">
              <CtaButton
                label={t("thankYouPage.cta.whatsapp")}
                href={whatsappUrl}
                variant="whatsapp"
                size="lg"
                loading={loading}
                icon={MessageCircle}
                className="max-w-lg"
              />
              <p className="font-sans text-xs leading-relaxed text-ink-muted sm:text-[13px]">
                {t("thankYouPage.cta.whatsappHint")}
              </p>
              <Link
                to="/"
                className="font-sans text-sm text-navy/60 underline-offset-4 transition-colors hover:text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 rounded-sm"
              >
                {t("thankYouPage.cta.homeLink")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-navy-deep py-10">
        <Backdrop variant="footer" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 text-center">
          <img
            src="/logo_more_dark.png"
            alt={t("thankYouPage.header.logoAlt")}
            className="h-12 w-auto opacity-90 sm:h-14"
          />
          <p className="font-sans text-sm text-white/70">{t("thankYouPage.footer.tagline")}</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-sans text-sm text-orange-light hover:text-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep rounded-sm"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} MORE. {t("thankYouPage.footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  )
}
