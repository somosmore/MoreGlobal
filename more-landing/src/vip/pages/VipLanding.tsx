export const VipLanding = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-navy">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange/10 text-sm font-bold text-orange">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                Asesoría VIP
              </span>
              <span className="text-xs text-gray-500">Landing dedicada (borrador)</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <section className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange">
            <span>Primer paso</span>
            <span className="h-1 w-1 rounded-full bg-orange" />
            <span>Cupos limitados por semana</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-balance text-3xl font-bold leading-tight text-navy sm:text-4xl md:text-5xl">
              Aquí irá el hero de la Asesoría VIP
            </h1>
            <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
              Esta página es la estructura base de la landing dedicada para la Asesoría VIP de MORE.
              Más adelante reemplazaremos estos textos por el copy final y la arquitectura CRO
              completa (hero, beneficios, prueba social, riesgo reverso y CTA).
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                CTA principal (placeholder)
              </p>
              <p className="max-w-md text-sm text-gray-600">
                El botón de abajo simula el CTA principal de la landing. En la siguiente fase
                definiremos el texto exacto, el enlace final y el tracking.
              </p>
            </div>
            <button
              type="button"
              className="flex min-h-[44px] items-center justify-center rounded-2xl bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange/30 transition-all duration-200 hover:bg-orange-dark hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              CTA de Asesoría VIP (placeholder)
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-gray-200 bg-white/80 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Secciones pendientes de contenido
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
            <li>• Bloque de beneficios y entregables de la sesión VIP.</li>
            <li>• Prueba social específica (casos, métricas y autoridad).</li>
            <li>• Explicación del mecanismo / método de trabajo.</li>
            <li>• Bloque de riesgo reverso y garantías.</li>
            <li>• CTA final y FAQs específicas de la asesoría.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}

