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
          <motion.a
            href="#registro"
            onClick={scrollToRegistro}
            className="badge-shine relative flex items-center justify-center gap-2 w-full sm:max-w-md sm:mx-auto h-12 min-h-[48px] rounded-lg bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white font-bold text-sm"
            animate={{
              y: [0, -2, 0],
              boxShadow: [
                "0 8px 24px rgba(243,112,33,0.4)",
                "0 14px 32px rgba(243,112,33,0.65)",
                "0 8px 24px rgba(243,112,33,0.4)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
          >
            <ArrowUp className="relative z-10 h-4 w-4 shrink-0" />
            <span className="relative z-10">RESERVAR MI LUGAR GRATIS</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
