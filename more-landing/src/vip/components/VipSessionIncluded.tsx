import { CheckCircle2 } from "lucide-react"

const benefits: {
  title: string
  description: string
  highlight?: boolean
}[] = [
  {
    title: "Tu foto migratoria actual",
    description: "Entendés con claridad dónde estás parado hoy frente a la Green Card.",
  },
  {
    title: "Tus puntos débiles priorizados",
    description: "Identificamos qué frena tu caso y qué mover primero.",
  },
  {
    title: "Plan accionable a 90 días",
    description: "Te llevas pasos concretos, con orden y foco.",
  },
  {
    title: "Decisión binaria sobre tu ruta",
    description: "Sí, no o todavía no para EB‑2 NIW u otra vía.",
  },
  {
    title: "PDF con tu hoja de ruta",
    description: "Resumen de tu diagnóstico y próximos pasos en un documento descargable.",
    highlight: true,
  },
] as const

export const VipSessionIncluded = () => {
  return (
    <section className="py-4">
      <div className="relative overflow-hidden rounded-3xl border-2 border-orange/30 bg-linear-to-br from-[#FFF8F4] to-white shadow-2xl">
        <div className="h-1.5 w-full bg-linear-to-r from-orange to-orange-dark" />

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
            En 60 minutos resolvemos:
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">
            No venís a escuchar teoría migratoria. Venís a tomar decisiones concretas sobre
            tu caso con números, riesgos y escenarios sobre la mesa.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <article
                key={item.title}
                className={
                  item.highlight
                    ? "flex gap-3 rounded-2xl border border-orange/25 bg-orange/5 p-3.5 shadow-sm"
                    : "flex gap-3 rounded-2xl bg-white/80 p-3.5 shadow-sm ring-1 ring-gray-100"
                }
              >
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange/10">
                  <CheckCircle2 className="h-4 w-4 text-orange" />
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

