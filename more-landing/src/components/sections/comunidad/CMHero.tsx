import { motion } from "framer-motion"
import { Check, Gift } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { COMUNIDAD_CTA_LABEL } from "./comunidadCopy"
import { scrollToRegistro } from "./scrollToRegistro"

const details = [
  "Acceso gratuito",
  "Te toma menos de un minuto",
]

export default function CMHero() {
  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-paper">
      <img
        src="/ivon-comunidad-hero.png"
        alt="Ivon More, fundadora de MORE"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_center] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-paper via-paper/95 via-42% to-paper/10 to-78%" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-paper/30 via-transparent to-paper/15" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-xl text-center lg:text-left">
          <motion.img
            src="/logo_more_light.png"
            alt="MORE"
            className="mx-auto mb-8 h-28 sm:h-32 lg:mx-0 lg:h-36"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange-wash px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#F37021]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-dark">
              Comunidad MORE · Acceso gratuito
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-navy-deep sm:text-4xl lg:text-5xl"
          >
              Decide tu camino a Estados Unidos con{" "}
              <span className="text-[#F37021]">información clara.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            La comunidad gratuita de MORE para profesionales que quieren entender sus
            opciones migratorias antes de dar el próximo paso.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start"
          >
            {details.map((detail) => (
              <div key={detail} className="flex items-center gap-2 text-sm text-ink-muted">
                <Check className="h-4 w-4 text-orange-dark" />
                <span>{detail}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8"
          >
            <CtaButton
              label={COMUNIDAD_CTA_LABEL}
              href="#registro"
              onClick={scrollToRegistro}
              size="lg"
              icon={null}
              className="w-auto font-bold"
            />
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-muted lg:justify-start">
              <Gift className="h-3.5 w-3.5 text-orange-dark" />
              Gratis · Sin compromiso · Te toma 30 segundos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
