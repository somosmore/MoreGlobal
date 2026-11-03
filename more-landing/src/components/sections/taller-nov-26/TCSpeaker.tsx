import { motion } from "framer-motion"

export default function TCSpeaker() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <div className="flex flex-col items-center gap-5 border border-navy/10 bg-paper p-6 sm:flex-row sm:p-8">
          <img
            src="/ivon.png"
            alt="Ivon More"
            className="h-24 w-24 shrink-0 rounded-full border-4 border-[#F37021]/20 object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-navy-deep">Ivon More</h3>
            <p className="mt-1 text-sm font-semibold text-orange-dark">
              Fundadora de MORE y del Instituto More de Educación Migratoria
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Junto al equipo de MORE ha acompañado a más de 200 profesionales a obtener su
              Green Card. En este taller comparte el método que usan con cada cliente para
              ordenar el perfil, elegir la ruta y no gastar de más.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
