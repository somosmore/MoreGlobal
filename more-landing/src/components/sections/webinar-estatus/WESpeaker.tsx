import { motion } from "framer-motion"

export default function WESpeaker() {
  return (
    <section className="bg-[#F4F6FB] py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:flex-row sm:p-8">
          <img
            src="/ivon.png"
            alt="Ivon More"
            className="h-24 w-24 shrink-0 rounded-full border-4 border-[#F37021]/20 object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-navy-deep">Ivon More</h3>
            <p className="mt-1 text-sm font-semibold text-[#F37021]">
              Fundadora de MORE — Instituto More
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7A9A]">
              En el Instituto More no te enseñamos a memorizar catálogos de
              visas. Te enseñamos a entender tu caso para decidir con claridad.
              En este webinar Ivon comparte el marco para leer tu propia
              historia migratoria — sin humo y con método.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
