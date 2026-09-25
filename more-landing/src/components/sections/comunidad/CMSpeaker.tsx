import { motion } from "framer-motion"
import { CtaButton } from "@/components/brand/CtaButton"
import { COMUNIDAD_CTA_LABEL } from "./comunidadCopy"
import { scrollToRegistro } from "./scrollToRegistro"

export default function CMSpeaker() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-gray-100 bg-[#F4F6FB] p-6 shadow-lg sm:flex-row sm:p-8">
          <img
            src="/ivon.png"
            alt="Ivon More"
            className="h-24 w-24 shrink-0 rounded-full border-4 border-[#F37021]/20 object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-navy-deep">Ivon More</h3>
            <p className="mt-1 text-sm font-semibold text-[#F37021]">
              Fundadora de MORE y del Instituto More de Educación Migratoria
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7A9A]">
              Junto al equipo de MORE ha acompañado a más de 200 profesionales a obtener su Green Card a
              través de la visa EB-2 NIW, sin necesidad de una oferta de empleo.
              En la comunidad comparte lo que aprendió caso a caso para que tomes
              decisiones con criterio propio.
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <CtaButton
            label={COMUNIDAD_CTA_LABEL}
            href="#registro"
            onClick={scrollToRegistro}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
        </div>
      </motion.div>
    </section>
  )
}
