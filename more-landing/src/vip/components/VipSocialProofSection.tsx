import { ShieldCheck, TrendingUp, Clock3 } from "lucide-react"

export const VipSocialProofSection = () => {
  return (
    <section className="py-20 sm:py-24">
      <div className="rounded-3xl bg-navy text-white shadow-xl ring-1 ring-navy/40">
        <div className="border-b border-white/10 px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange/80">
            Aprobaciones recientes · Casos reales
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">
              Prueba concreta de lo que pasa cuando se decide con estrategia y no con intuición.
            </h2>
            <p className="max-w-sm text-xs leading-relaxed text-slate-200/90">
              Métricas agregadas de procesos EB2-NIW y otras rutas estratégicas trabajadas con el
              equipo MORE en los últimos meses.
            </p>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-8 sm:grid-cols-3 sm:px-10 sm:py-10">
          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <ShieldCheck className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Aprobaciones en ventana reciente
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">92%</p>
            <p className="text-xs leading-relaxed text-slate-200">
              Porcentaje de casos aprobados entre perfiles calificados que pasaron primero por
              diagnóstico estratégico.
            </p>
          </article>

          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <TrendingUp className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Perfiles de alto impacto evaluados
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">+200</p>
            <p className="text-xs leading-relaxed text-slate-200">
              Profesionales, fundadores y ejecutivos que decidieron validar su ruta antes de
              invertir miles de dólares en el camino equivocado.
            </p>
          </article>

          <article className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Clock3 className="h-4 w-4 text-orange" />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Tiempo promedio de decisión
              </p>
            </div>
            <p className="text-2xl font-semibold text-white">90 días</p>
            <p className="text-xs leading-relaxed text-slate-200">
              Horizonte típico para pasar de “no sé si califico” a ejecutar una ruta migratoria
              definida con respaldo documental.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

