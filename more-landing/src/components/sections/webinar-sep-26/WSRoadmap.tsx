import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { scrollToRegistro } from "./scrollToRegistro"

const masterclasses = [
  {
    number: 1,
    title: "El nuevo panorama migratorio de Estados Unidos",
    status: "3 de septiembre · Inscripción abierta",
    open: true,
  },
  {
    number: 2,
    title: "Cómo entender tu estatus migratorio",
    status: "Próximamente",
    open: false,
  },
  {
    number: 3,
    title: "El mapa de las visas estadounidenses",
    status: "Próximamente",
    open: false,
  },
  {
    number: 4,
    title: "Cómo construir un proyecto profesional internacional",
    status: "Próximamente",
    open: false,
  },
  {
    number: 5,
    title:
      "Inteligencia documental: los documentos que todo inmigrante debe conocer",
    status: "Próximamente",
    open: false,
  },
  {
    number: 6,
    title: "Cómo leer una política de USCIS sin ser abogado",
    status: "Próximamente",
    open: false,
  },
  {
    number: 7,
    title: "Tendencias migratorias y planificación estratégica",
    status: "Próximamente",
    open: false,
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function WSRoadmap() {
  return (
    <section className="bg-[#F4F6FB] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2">
            <GraduationCap className="h-4 w-4 text-orange-dark" />
            <span className="text-xs font-semibold uppercase tracking-widest text-navy-deep">
              Instituto More de Educación Migratoria
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-navy-deep sm:text-3xl">
            No estás entrando a un webinar.{" "}
            <span className="text-[#F37021]">Estás entrando a una escuela.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            La Masterclass 1 es el primer capítulo de una ruta completa de
            aprendizaje migratorio. Quien entra ahora recorre la ruta desde el
            principio.
          </p>
        </motion.div>

        <motion.ol
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={container}
          className="space-y-3"
        >
          {masterclasses.map((mc) => (
            <motion.li
              key={mc.number}
              variants={item}
              className={`flex items-start gap-4 rounded-2xl border p-4 sm:p-5 ${
                mc.open
                  ? "border-[#F37021]/40 bg-white shadow-md"
                  : "border-navy/10 bg-white/60"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  mc.open
                    ? "bg-orange text-white"
                    : "bg-navy/10 text-navy-deep/70"
                }`}
              >
                {mc.number}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold leading-snug sm:text-base ${
                    mc.open ? "text-navy-deep" : "text-navy-deep/70"
                  }`}
                >
                  {mc.title}
                </p>
                <p
                  className={`mt-1 text-xs font-medium ${
                    mc.open ? "text-orange-dark" : "text-ink-muted"
                  }`}
                >
                  {mc.status}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <div className="mt-10 flex justify-center">
          <CtaButton
            label="Quiero empezar por la Masterclass 1"
            href="#registro"
            onClick={scrollToRegistro}
            size="lg"
            icon={null}
            className="w-auto font-bold"
          />
        </div>
      </div>
    </section>
  )
}
