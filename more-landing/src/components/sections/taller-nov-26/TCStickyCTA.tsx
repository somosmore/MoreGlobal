import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plane } from "lucide-react"
import { TALLER_CTA_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"

/** Barra fija: se oculta cuando las entradas o el formulario ya están en pantalla. */
export default function TCStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.8
      const inView = (id: string) => {
        const rect = document.getElementById(id)?.getBoundingClientRect()
        return rect ? rect.top < window.innerHeight && rect.bottom > 0 : false
      }
      setVisible(pastHero && !inView("entradas") && !inView("registro"))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy-ink/95 px-4 py-3 backdrop-blur-md"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div className="hidden items-center gap-3 text-white sm:flex">
              <Plane className="h-4 w-4 text-orange" aria-hidden />
              <div className="leading-tight">
                <p className="text-sm font-semibold">Taller Comunidad More</p>
                <p className="text-xs text-navy-soft">Lun 23 Nov · 19:00 COT · En vivo</p>
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToEntradas}
              className="cta-shine flex min-h-[48px] w-full items-center justify-center rounded-full bg-orange px-8 text-sm font-bold text-white shadow-md shadow-orange/25 hover:bg-orange-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:w-auto"
            >
              {TALLER_CTA_LABEL}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
