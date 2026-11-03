import { motion } from "framer-motion"
import { Briefcase, Building2, Check, Plane, X } from "lucide-react"

/** Un mensaje por perfil: lo que conmueve a uno no le habla al otro. */
const profiles = [
  {
    icon: Briefcase,
    label: "Profesional con trayectoria",
    who: "10 a 25 años de experiencia, título y casi siempre maestría. Sientes que llegaste a un tope en tu país.",
    message: "Tu trayectoria vale en EE.UU. Te mostramos cómo demostrarlo, sin empezar de cero.",
  },
  {
    icon: Building2,
    label: "Empresario que quiere expandirse",
    who: "Tienes una empresa con años de operación y quieres facturar en dólares, sin dejar tu base.",
    message: "Lleva tu empresa a EE.UU. y entra y sale cuando quieras. Te explicamos qué estructura sirve.",
  },
  {
    icon: Plane,
    label: "Ya estás en EE.UU.",
    who: "Vives allá con una visa temporal o de trabajo y estás cansado de depender de un empleador o de renovar.",
    message: "Deja de vivir de renovación en renovación. Conoce tus opciones para una residencia propia.",
  },
]

const yes = [
  "Quieres llegar a EE.UU. o crecer allá, pero no sabes por dónde empezar.",
  "Buscas una ruta clara que se ajuste a tu perfil y a tu presupuesto.",
  "Prefieres decidir con estrategia, no con rumores ni con prisa.",
]

const no = [
  "Buscas promesas de visa garantizada o atajos mágicos.",
  "No estás dispuesto a invertir tiempo en entender tu proceso.",
  "Esperas asesoría legal personalizada de tu caso durante el taller.",
]

export default function TCAudience() {
  return (
    <section className="bg-paper-warm py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
            Para quién es
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            ¿Este taller es para ti?
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {profiles.map(({ icon: Icon, label, who, message }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex flex-col rounded-2xl border border-navy/10 bg-white p-6"
            >
              {/* Iconografía duotono del manual: círculo sólido, alternando navy y naranja */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  index % 2 === 0 ? "bg-navy-deep" : "bg-orange"
                }`}
              >
                <Icon className="h-5 w-5 text-white" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy-deep">{label}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{who}</p>
              <p className="mt-4 border-l-2 border-orange pl-3 text-sm font-semibold leading-snug text-navy-deep">
                {message}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-4 max-w-3xl text-center text-xs leading-relaxed text-ink-muted">
          Si tienes un asilo, TPS u otro proceso abierto, el taller te sirve para entender el
          panorama; tu caso puntual lo revisamos con nuestra abogada aliada.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-navy-deep">Sí es para ti si…</p>
            <ul className="mt-4 space-y-3">
              {yes.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-deep">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-navy/10 bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-navy-deep">No es para ti si…</p>
            <ul className="mt-4 space-y-3">
              {no.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
