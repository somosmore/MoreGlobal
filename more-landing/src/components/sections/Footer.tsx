import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { MessageCircle, Mail, MapPin, Instagram, Linkedin, Facebook, Youtube } from "lucide-react"
import { Backdrop } from "@/components/brand/Backdrop"
import { CtaButton } from "@/components/brand/CtaButton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useWhatsappUrl } from "@/hooks/useWhatsappUrl"
import { useTranslation } from "react-i18next"

type FooterProps = {
  hideLandingFaq?: boolean
}

export default function Footer({ hideLandingFaq = false }: FooterProps) {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const whatsappUrl = useWhatsappUrl()

  const faqs = hideLandingFaq
    ? []
    : (t("footer.faqs", { returnObjects: true }) as Array<{ question: string; answer: string }>)
  const quickLinks = t("footer.quickLinks", { returnObjects: true }) as Array<{ label: string; href: string }>

  const socialLinks = [
    { url: settings.instagram_url, Icon: Instagram, label: "Instagram" },
    { url: settings.linkedin_url, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.facebook_url, Icon: Facebook, label: "Facebook" },
    { url: settings.youtube_url, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url.trim())

  return (
    <>
      {!hideLandingFaq && (
        <section className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
                {t("footer.faqEyebrow")}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
                {t("footer.faqTitle")}
              </h2>
              <p className="mt-4 text-gray-500 text-lg">{t("footer.faqSubtitle")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow duration-300"
                  >
                    <AccordionTrigger className="text-left text-[#2A3A4A] font-medium text-[15px] py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-[15px] leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-navy-deep py-20">
        <Backdrop variant="footer" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 font-display text-4xl leading-tight text-white sm:text-5xl">
              {t("footer.ctaTitle")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-sans text-lg text-white/70">
              {t("footer.ctaSubtitle")}
            </p>
            <div className="flex justify-center">
              <CtaButton
                label={t("footer.ctaButton")}
                href={whatsappUrl(t("footer.ctaWhatsappMsg"))}
                size="lg"
                icon={MessageCircle}
                className="w-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#2A3A4A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo_more_dark.png"
                  alt={t("footer.logoAlt")}
                  loading="lazy"
                  className="h-40 w-40"
                />
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                {t("footer.brandDesc")}
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                {t("footer.quickLinksTitle")}
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-[#F37021] text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                {t("footer.contactTitle")}
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <Mail className="w-4 h-4 text-[#F37021]" />
                  {settings.contact_email}
                </li>
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <MessageCircle className="w-4 h-4 text-[#F37021]" />
                  {settings.contact_phone}
                </li>
                <li className="flex items-start gap-3 text-white/40 text-sm">
                  <MapPin className="w-4 h-4 text-[#F37021] mt-0.5" />
                  <a
                    href="https://maps.app.goo.gl/8XhFirGFazKVx68D6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F37021] transition-colors"
                  >
                    1250 W Sam Houston Pkwy S - Houston, Texas, United States, Piso 8, Oficina 800
                  </a>
                </li>
                {socialLinks.map(({ url, Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-white/40 text-sm">
                    <Icon className="w-4 h-4 text-[#F37021] shrink-0" aria-hidden="true" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="hover:text-[#F37021] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {t("footer.terms")}
              </a>
              <Link
                to="/privacidad"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
