export const VipValueSection = () => {
  return (
    <section className="rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-xl text-[clamp(1.25rem,2.4vw,1.6rem)] font-semibold leading-snug text-navy">
          No estás pagando una opinión más. Estás comprando una decisión migratoria tomada con datos,
          riesgos y escenarios claros delante tuyo.
        </h2>
        <p className="max-w-xs text-[11px] text-gray-500 sm:text-xs">
          Esta asesoría funciona como un comité estratégico: miramos tu perfil, tus tiempos y
          tu capacidad de inversión para decidir si tiene sentido avanzar — y cómo.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <article className="space-y-2 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-200/70">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-500">
            Si decidís avanzar sin este diagnóstico
          </p>
          <ul className="mt-1.5 space-y-1.5 text-sm text-gray-700">
            <li>• Apostar miles de dólares a una estrategia que nadie validó.</li>
            <li>• Pagar honorarios sin saber exactamente qué te está faltando.</li>
            <li>• Vivir meses en modo “a ver qué pasa con el caso”.</li>
            <li>• Arrastrar a tu familia a decisiones tomadas casi a ciegas.</li>
          </ul>
        </article>
        <article className="space-y-2 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200/70">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Si primero pasás por la Asesoría VIP
          </p>
          <ul className="mt-1.5 space-y-1.5 text-sm text-gray-700">
            <li>• Decisión binaria: sí, no o todavía no para tu Green Card.</li>
            <li>• Ruta concreta a 90 días alineada a tu realidad, no a un check‑list genérico.</li>
            <li>• Claridad sobre el costo real de seguir igual vs. avanzar.</li>
            <li>• Un PDF con tu hoja de ruta para conversar con tu familia o socios.</li>
          </ul>
        </article>
      </div>
    </section>
  )
}

