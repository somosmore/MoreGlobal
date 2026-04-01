export const VipFitSection = () => {
  return (
    <section className="grid gap-6 rounded-3xl bg-white p-6 text-navy shadow-sm ring-1 ring-gray-100 sm:grid-cols-2 sm:p-8">
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-orange/90">
          Esta asesoría es para ti si...
        </h2>
        <p className="text-sm text-gray-700">
          No buscamos convencer a todo el mundo. Buscamos trabajar con personas que tratan
          su migración como una decisión de negocio, no como una apuesta impulsiva.
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
          <li>• Tenés trayectoria real como profesional, empresario/a o emprendedor/a.</li>
          <li>• Querés una visa que refleje tu perfil, no “la que salga”.</li>
          <li>• Ya probaste asesorías genéricas y seguís sin una respuesta clara.</li>
          <li>• Querés saber si EB‑2 NIW u otra ruta tiene sentido antes de invertir fuerte.</li>
          <li>• Preferís decidir con datos y estrategia, no solo con ilusión.</li>
        </ul>
      </div>
      <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-rose-300/60">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-800">
          Esta asesoría NO es para ti si...
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
          <li>• Buscás una promesa mágica de aprobación sin hacer tu parte.</li>
          <li>• Solo querés que “alguien te arme papeles” sin entender la estrategia.</li>
          <li>• No estás dispuesto/a a invertir tiempo, dinero y foco en tu proyecto migratorio.</li>
          <li>• Preferís que te digan lo que querés escuchar, en lugar de la verdad.</li>
        </ul>
        <p className="mt-3 text-[11px] text-gray-600">
          Si después de leer esto sentís que la sesión no es para vos, probablemente esta
          honestidad ya te ahorró una mala decisión.
        </p>
      </div>
    </section>
  )
}

