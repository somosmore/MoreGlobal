import { motion } from "framer-motion"

export const VipAboutIvon = () => {
  return (
    <motion.section
      className="grid gap-8 rounded-3xl bg-white p-6 text-navy shadow-sm ring-1 ring-gray-100 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,1.1fr)] sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange/80">
            Quién está del otro lado de la llamada
          </p>
          <h2 className="text-[clamp(1.25rem,2.3vw,1.5rem)] font-semibold text-navy">
            Ivon vivió en carne propia la migración familiar y empresarial que hoy ayuda a
            diseñar con lupa estratégica para otros.
          </h2>
        </div>
        <p className="text-sm text-gray-700">
          Soy mamá, esposa, profesional y empresaria. Migré con mi familia y mi empresa sin
          un mapa claro, pagando errores caros en tiempo y dinero. Esa experiencia hoy se
          traduce en decisiones más inteligentes para tus próximos pasos.
        </p>
        <details className="group rounded-2xl bg-gray-50 p-4 text-sm text-gray-800 ring-1 ring-orange/25">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-navy">
            <span>Cómo trabajamos en MORE</span>
            <span className="text-xs text-orange/80 group-open:hidden">Ver historia completa</span>
            <span className="hidden text-xs text-orange/80 group-open:inline">Ocultar</span>
          </summary>
          <p className="mt-3 text-sm text-gray-700">
            Trabajamos con profesionales y empresarios de múltiples industrias bajo una misma lógica:
            proyecto, evidencia y estrategia. Nuestro equipo multidisciplinario ha acompañado
            aprobaciones en distintas categorías de visa, siempre empezando por un diagnóstico honesto,
            sin guiones comerciales.
          </p>
        </details>
        <ul className="mt-2 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <li>✔ Experiencia migratoria personal, familiar y empresarial.</li>
          <li>✔ Equipo de estrategas, no solo preparadores o abogados.</li>
          <li>✔ Casos aprobados en múltiples categorías y contextos.</li>
          <li>✔ Visión de negocio aplicada a tu proyecto migratorio.</li>
        </ul>
      </div>

      <div className="flex items-center justify-center">
        <figure className="relative w-full max-w-xs">
          <div className="relative aspect-3/4 overflow-hidden rounded-[30px] bg-white p-1 ring-1 ring-gray-200 shadow-lg">
            <div className="flex h-full flex-col justify-between rounded-[28px] bg-gray-50 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700">
                  Ivon More
                </span>
                <span className="rounded-full bg-orange/10 px-2.5 py-0.5 text-[10px] font-medium text-orange/90 ring-1 ring-orange/40">
                  Fundadora & Estratega MORE
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center text-center text-xs text-gray-500">
                <div className="mb-3 h-20 w-20 rounded-3xl bg-gray-200 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  <div className="flex h-full w-full items-center justify-center">
                    Foto de Ivon
                  </div>
                </div>
                <p className="max-w-60 text-[11px] leading-relaxed text-gray-700">
                  “No todos los perfiles sostienen una Green Card, y está bien. Mi trabajo en esta
                  sesión es mostrarte con honestidad qué sí se puede construir y en qué tiempos.”
                </p>
              </div>

              <div className="space-y-1.5 rounded-2xl bg-white px-3 py-2 text-[11px] text-gray-700 ring-1 ring-gray-200">
                <p className="font-semibold text-navy">
                  En esta sesión vamos a hablar como pares:
                </p>
                <ul className="space-y-1.5">
                  <li>• Tu proyecto y realidad, no la teoría de inmigración.</li>
                  <li>• Riesgos, tiempos y retorno esperado de tu migración.</li>
                  <li>• Qué decisión tiene más sentido para vos hoy.</li>
                </ul>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </motion.section>
  )
}

