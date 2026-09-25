import { motion } from "framer-motion"
import { Gift, Users, Video, GraduationCap } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { Backdrop } from "@/components/brand/Backdrop"
import { COMUNIDAD_CTA_LABEL } from "./comunidadCopy"
import { scrollToRegistro } from "./scrollToRegistro"

const details = [
  { icon: Gift, text: "Acceso 100% gratuito" },
  { icon: Video, text: "Contenido de Ivon More" },
  { icon: GraduationCap, text: "Prioridad en masterclasses" },
  { icon: Users, text: "Red de profesionales" },
]

export default function CMHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-paper">
      <Backdrop variant="hero" className="opacity-70" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-24 pb-24 sm:px-6 lg:px-8 lg:pb-32">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
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
              Tu camino a Estados Unidos no tienes que recorrerlo{" "}
              <span className="text-[#F37021]">solo.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              Únete a la comunidad de MORE en Facebook y recibe información clara
              sobre visas y rutas migratorias para profesionales, directamente de
              Ivon More y su equipo.{" "}
              <strong className="font-semibold text-navy-deep">
                Sin rumores de redes, sin letra pequeña: criterio para decidir tu
                próximo paso.
              </strong>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start"
            >
              {details.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-sm text-ink-muted"
                >
                  <Icon className="h-4 w-4 text-orange-dark" />
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

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-64 shrink-0 sm:w-72 lg:w-80 xl:w-96"
          >
            <img
              src="/ivon.png"
              alt="Ivon More — Fundadora de MORE"
              className="relative w-full rounded-2xl border border-navy/15 object-cover shadow-xl"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-4 text-center"
            >
              <p className="text-lg font-bold text-navy-deep">Ivon More</p>
              <p className="text-sm font-medium text-orange-dark">
                Fundadora de MORE y del Instituto More
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
