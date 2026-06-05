import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"

type UppStickyCtaProps = {
  paymentLink?: string | null
  price?: string | null
  loading?: boolean
}

export function UppStickyCta({ paymentLink, price, loading }: UppStickyCtaProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const effectivePrice = price || "$2,500"

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7
      const pricingEl = document.getElementById("upp-pricing")
      const pricingTop = pricingEl?.getBoundingClientRect().top ?? Infinity

      setVisible(window.scrollY > heroHeight && pricingTop > window.innerHeight * 0.5)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (loading || !paymentLink) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="upp-no-print fixed bottom-0 left-0 right-0 z-50 border-t border-[#0A3161]/20 bg-[#0A3161]/95 backdrop-blur-md p-3 shadow-[0_-4px_20px_rgba(10,49,97,0.3)] sm:p-4"
        >
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate sm:text-sm">
                {t("uppPage.stickyCta.text")}
              </p>
              <p className="text-xs text-white/60">
                {t("uppPage.stickyCta.subtext", { price: effectivePrice })}
              </p>
            </div>
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange to-orange-dark px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange/25 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("uppPage.cta.payNow")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
