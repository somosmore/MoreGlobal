import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Ticket } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { TALLER_CTA_LABEL } from "./tallerNov26Copy"
import { scrollToEntradas } from "./scrollToRegistro"

/** Barra fija: se oculta cuando las entradas o el formulario ya están en pantalla. */
export default function TCStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.7
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
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-navy/15 bg-paper/95 p-4 shadow-sm backdrop-blur-md"
        >
          <CtaButton
            label={TALLER_CTA_LABEL}
            href="#entradas"
            onClick={scrollToEntradas}
            icon={Ticket}
            className="font-bold sm:mx-auto sm:max-w-md"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
