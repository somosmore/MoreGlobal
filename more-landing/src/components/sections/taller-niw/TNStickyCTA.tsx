import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { scrollToRegistro } from "./scrollToRegistro"

export default function TNStickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.7
      const formEl = document.getElementById("registro")
      const formTop = formEl?.getBoundingClientRect().top ?? Infinity

      setVisible(window.scrollY > heroHeight && formTop > window.innerHeight * 0.5)
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
            label="Sí, quiero mi lugar en el taller"
            href="#registro"
            onClick={scrollToRegistro}
            icon={ArrowUp}
            className="font-bold sm:mx-auto sm:max-w-md"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
