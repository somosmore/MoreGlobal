import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Zap } from "lucide-react"

type TurboStickyCtaProps = {
  paymentLink?: string | null
  price?: string | null
  loading?: boolean
}

export function TurboStickyCta({ paymentLink, price, loading }: TurboStickyCtaProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const effectivePrice = price || "$8,000"

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (loading) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        >
          <div className="border-t border-white/10 bg-[#0A1F3D]/95 px-4 py-3 pb-safe backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-white/60 leading-none">Plan Turbo</p>
                  <p className="text-sm font-bold text-white leading-tight">{effectivePrice} USD</p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <a
                  href={t("turboPage.cta.whatsappUrl")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/20 px-3 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Asesor
                </a>
                {paymentLink ? (
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-orange to-orange-dark px-4 text-xs font-bold text-white shadow-lg shadow-orange/25"
                  >
                    {t("turboPage.cta.payNow")}
                  </a>
                ) : (
                  <span className="inline-flex h-10 items-center justify-center rounded-xl bg-orange/40 px-4 text-xs font-bold text-white/70 cursor-not-allowed">
                    {t("turboPage.cta.comingSoon")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
