import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Gift, User } from "lucide-react"

const details = [
  { icon: Calendar, text: "25, 26 y 27 de mayo 2026" },
  { icon: Clock, text: "7:00 PM (hora Colombia)" },
  { icon: MapPin, text: "Online y en vivo" },
  { icon: Gift, text: "100% gratis" },
  { icon: User, text: "Con Ivon More" },
]

export default function MCHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0033A0] to-[#001A52]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-white/[0.04] blur-3xl"
          animate={{ x: [0, -28, 0], y: [0, 24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-[#F37021]/[0.12] blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 0.92, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#F37021]/[0.06] blur-3xl"
          animate={{ y: [0, -18, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
        <motion.img
          src="/logo_more_dark.png"
          alt="MORE"
          className="h-24 sm:h-32 lg:h-40 mx-auto mb-10 drop-shadow-[0_22px_40px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, scale: 0.85, y: -18 }}
          animate={{ opacity: 1, scale: [1, 1.03, 1], y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6 },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight"
        >
          El{" "}
          <span className="text-[#F37021]">Paso Cero</span>
          {" "}para migrar a EE.UU. con visa EB2-NIW
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          Descubre la ruta que usan los profesionales latinoamericanos para
          obtener la residencia permanente sin necesidad de empleador.{" "}
          <strong className="text-white font-semibold">
            3 días de contenido en vivo.
          </strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {details.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <Icon className="h-4 w-4 text-[#F37021]" />
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <motion.a
            href="#registro"
            className="inline-flex items-center justify-center h-13 px-8 text-base font-bold text-white bg-gradient-to-r from-[#F37021] to-[#D4611A] rounded-lg shadow-lg hover:from-[#D4611A] hover:to-[#F37021] transition-all duration-300 hover:shadow-xl"
            animate={{ y: [0, -3, 0], boxShadow: ["0 10px 24px rgba(243,112,33,0.35)", "0 16px 36px rgba(243,112,33,0.55)", "0 10px 24px rgba(243,112,33,0.35)"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            QUIERO MI LUGAR GRATIS
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
