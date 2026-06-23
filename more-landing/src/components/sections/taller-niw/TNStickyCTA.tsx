import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <a
            href="#registro"
            onClick={scrollToRegistro}
            className="flex items-center justify-center gap-2 w-full sm:max-w-md sm:mx-auto h-12 rounded-lg bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white font-bold text-sm shadow-lg"
          >
            <ArrowUp className="h-4 w-4" />
            RESERVAR MI LUGAR GRATIS
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
