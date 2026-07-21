import { motion } from "framer-motion"

export default function TNSpeaker() {
  return (
    <section className="py-8 sm:py-10 bg-[#F4F6FB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
          <img
            src="/ivon.png"
            alt="Ivon More"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#F37021]/20 shrink-0"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-navy-deep">Ivon More</h3>
            <p className="text-sm font-semibold text-[#F37021] mt-1">
              Fundadora de MORE — Migración con Propósito
            </p>
            <p className="text-[#6B7A9A] text-sm mt-3 leading-relaxed">
              Con años dentro de la industria de la inmigración, conoce de cerca
              las malas prácticas que cuestan a las familias miles de dólares.
              En este taller revela, sin filtros, las señales de alerta que
              debes detectar antes de confiarle tu caso a cualquier abogado.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
