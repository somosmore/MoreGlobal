import { motion } from "framer-motion"
import { MessageCircle, Mail, MapPin, Instagram, Linkedin, Facebook, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSiteSettings } from "@/hooks/useSiteSettings"
import { useTranslation } from "react-i18next"

type FooterProps = {
  hideLandingFaq?: boolean
}

export default function Footer({ hideLandingFaq = false }: FooterProps) {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()

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

      <section className="py-20 bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F37021]/[0.05] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#F37021]/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("footer.ctaTitle")}
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              {t("footer.ctaSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gold" size="lg" className="gap-2" asChild>
                <a
                  href={t("footer.ctaWhatsapp")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t("footer.ctaButton")}
                </a>
              </Button>
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
                  soporte@justmore.net
                </li>
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <MessageCircle className="w-4 h-4 text-[#F37021]" />
                  +1 (548) 312-2105
                </li>
                <li className="flex items-start gap-3 text-white/40 text-sm">
                  <MapPin className="w-4 h-4 text-[#F37021] mt-0.5" />
                  4538 Bagley Garden Ct, Katy TX 77449, United States
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
              <a
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {t("footer.privacy")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
