import { motion } from "framer-motion"
import { CtaButton } from "@/components/brand/CtaButton"
import { scrollToRegistro } from "./scrollToRegistro"

export default function WETension() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6"
      >
        <h2 className="font-display text-2xl font-bold leading-tight text-navy-deep sm:text-3xl">
          La confusión más cara no es «elegir mal la visa»… es{" "}
          <span className="text-[#F37021]">no saber dónde estás parado</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          El Departamento de Estado confirma que la fecha de vencimiento de una
          visa <strong className="font-semibold text-navy-deep">no</strong> es lo
          mismo que el período autorizado de permanencia. CBP determina la
          admisión; el I-94 registra cuánto tiempo estás autorizado… o «D/S».
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          Si no sabes leer eso, estás tomando decisiones con información
          incompleta.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton
            label="Quiero dejar de adivinar mi estatus"
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
