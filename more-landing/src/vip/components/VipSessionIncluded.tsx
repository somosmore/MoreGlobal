import { CheckCircle2, ShieldCheck, Clock3, LineChart, Headphones, Sparkles } from "lucide-react"

const pillars: {
  title: string
  description: string
  highlight?: boolean
}[] = [
  {
    title: "Blindaje Documental",
    description:
      "Eliminamos los errores y vacíos que explican la mayoría de los rechazos. Tu caso se presenta con rigor quirúrgico.",
    highlight: true,
  },
  {
    title: "Estrategia de Autoridad",
    description:
      "Elevamos cómo se ve tu perfil ante los ojos de USCIS para que no parezca “un buen currículum más”, sino un caso estratégico.",
  },
  {
    title: "Optimización de Tiempos",
    description:
      "Ordenamos tu ruta para que avances sin cuellos de botella ni meses perdidos en burocracia o pasos irrelevantes.",
  },
  {
    title: "Soporte de Élite",
    description:
      "Acceso directo a expertos que ya han visto cientos de perfiles como el tuyo para decidir con criterio, no con intuición.",
  },
  {
    title: "Simulación de Escenarios",
    description:
      "Probamos distintos caminos posibles antes de cualquier interacción oficial, para que sepas qué implica cada decisión.",
  },
] as const

export const VipSessionIncluded = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl border border-orange/25 bg-linear-to-br from-[#FFF8F4] via-white to-[#FFF3E6] shadow-xl">
        <div className="h-1.5 w-full bg-linear-to-r from-orange to-orange-dark" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-orange">
                <Sparkles className="h-3 w-3 text-orange" />
                Método MORE VIP
              </p>
              <h2 className="mt-3 max-w-xl font-serif text-2xl font-semibold leading-snug text-navy sm:text-3xl">
                Los 5 pilares estratégicos que sostienen tu decisión migratoria.
              </h2>
            </div>
            <p className="max-w-md font-sans text-sm leading-relaxed text-gray-600">
              En vez de una lista infinita de servicios, estructuramos la sesión en cinco pilares
              claros para que entiendas exactamente qué se está fortaleciendo de tu caso.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className={
                  item.highlight
                    ? "group flex flex-col gap-3 rounded-2xl border border-orange/40 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    : "group flex flex-col gap-3 rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                }
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange/10">
                    {item.title === "Blindaje Documental" && (
                      <ShieldCheck className="h-4 w-4 text-orange" />
                    )}
                    {item.title === "Estrategia de Autoridad" && (
                      <LineChart className="h-4 w-4 text-orange" />
                    )}
                    {item.title === "Optimización de Tiempos" && (
                      <Clock3 className="h-4 w-4 text-orange" />
                    )}
                    {item.title === "Soporte de Élite" && (
                      <Headphones className="h-4 w-4 text-orange" />
                    )}
                    {item.title === "Simulación de Escenarios" && (
                      <CheckCircle2 className="h-4 w-4 text-orange" />
                    )}
                  </div>
                  {item.highlight && (
                    <span className="rounded-full bg-orange/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange">
                      Núcleo del diagnóstico
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

