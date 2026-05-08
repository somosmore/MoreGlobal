import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Gift, User } from "lucide-react"
import MCCountdown from "./MCCountdown"

const details = [
  { icon: Calendar, text: "25 de mayo 2026" },
  { icon: Clock, text: "7:00 PM (hora Colombia)" },
  { icon: MapPin, text: "Online y en vivo" },
  { icon: Gift, text: "100% gratis" },
  { icon: User, text: "Con Ivon More" },
]

export default function MCHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-[#0033A0] to-[#001A52]">
      {/* Background blobs */}
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

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.img
              src="/logo_more_dark.png"
              alt="MORE"
              className="h-60 sm:h-72 lg:h-84 mx-auto lg:mx-0 mb-8 drop-shadow-[0_22px_40px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F37021]/20 border border-[#F37021]/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#F37021] animate-pulse" />
              <span className="text-xs font-semibold text-white tracking-widest uppercase">
                Masterclass gratuita
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Descubre si tu perfil profesional puede{" "}
              <span className="text-[#F37021]">calificar para la Green Card EB-2</span>
              {" "}y llévate un plan paso a paso para buscar la residencia en EE.&nbsp;UU.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
            >
              Sin depender de un empleador patrocinador, sin inversiones altas de capital
              y evitando gastos innecesarios en abogados desde el inicio.{" "}
              <strong className="text-white font-semibold">
                Una clase en vivo que puede cambiarlo todo.
              </strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-3"
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
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8"
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-6 max-w-xs mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>Cupos ocupados</span>
                <span className="font-semibold text-[#F37021]">87%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A]"
                  initial={{ width: 0 }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right: Speaker image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative shrink-0 w-64 sm:w-72 lg:w-80 xl:w-96"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#F37021]/20 to-[#F37021]/5 blur-2xl" />
              <img
                src="/ivon.png"
                alt="Ivon More — Fundadora de MORE"
                className="relative w-full rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#001A52] to-transparent rounded-b-2xl" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4 text-center"
            >
              <p className="text-white font-bold text-lg">Ivon More</p>
              <p className="text-[#F37021] text-sm font-medium">
                Fundadora de MORE — Migración con Propósito
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Countdown — full width below the split */}
        <MCCountdown />
      </div>
    </section>
  )
}
