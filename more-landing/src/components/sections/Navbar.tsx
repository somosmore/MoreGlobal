import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleLanguage = () => {
    const next = i18n.language.startsWith("en") ? "es" : "en"
    i18n.changeLanguage(next)
  }

  const navLinks = [
    { labelKey: "navbar.methodology", href: "#metodologia" },
    { labelKey: "navbar.whoWeHelp", href: "#quienes-ayudamos" },
    { labelKey: "navbar.programs", href: "#programas" },
    { labelKey: "navbar.success", href: "#exito" },
  ]

  const currentLang = i18n.language.startsWith("en") ? "EN" : "ES"
  const otherLang = currentLang === "EN" ? "ES" : "EN"

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          <a href="#" className="flex items-center">
            <img
              src="/logo_more_light.png"
              alt={t("navbar.logoAlt")}
              className="h-30 w-auto"
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#2A3A4A] transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#F37021] after:transition-all after:duration-300 hover:after:w-full"
              >
                {t(link.labelKey)}
              </a>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-0.5 text-xs font-semibold text-gray-500 hover:text-[#F37021] transition-colors duration-200 min-h-[44px] min-w-[44px] justify-center"
              aria-label={`Switch to ${otherLang}`}
            >
              <span className={currentLang === "ES" ? "text-[#F37021]" : "text-gray-400"}>ES</span>
              <span className="text-gray-300 mx-0.5">|</span>
              <span className={currentLang === "EN" ? "text-[#F37021]" : "text-gray-400"}>EN</span>
            </button>

            <Button size="sm" variant="gold" asChild>
              <a href="#quiz">{t("navbar.cta")}</a>
            </Button>
          </div>

          <button
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-[#2A3A4A]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? t("navbar.closeMenu") : t("navbar.openMenu")}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-100/50"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-gray-600 hover:text-[#2A3A4A] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t(link.labelKey)}
                </a>
              ))}

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-0.5 text-xs font-semibold text-gray-500 hover:text-[#F37021] transition-colors duration-200"
                aria-label={`Switch to ${otherLang}`}
              >
                <span className={currentLang === "ES" ? "text-[#F37021]" : "text-gray-400"}>ES</span>
                <span className="text-gray-300 mx-0.5">|</span>
                <span className={currentLang === "EN" ? "text-[#F37021]" : "text-gray-400"}>EN</span>
              </button>

              <Button className="w-full" size="sm" asChild>
                <a href="#quiz" onClick={() => setIsOpen(false)}>
                  {t("navbar.cta")}
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
