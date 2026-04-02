import { motion } from "framer-motion"

export const VipValueSection = () => {
  return (
    <motion.section
      className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="space-y-3">
        <h2 className="max-w-xl text-[clamp(1.5rem,2.6vw,1.9rem)] font-semibold leading-snug text-navy">
          No estás pagando una opinión más. Estás comprando una decisión migratoria tomada con datos,
          riesgos y escenarios claros delante tuyo.
        </h2>
        <p className="max-w-xl text-sm text-gray-600 sm:text-base">
          En vez de sumar opiniones, actuamos como tu comité estratégico para decidir con datos si
          tiene sentido avanzar ahora o no.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-dark">
          Qué cambia al pasar por la Asesoría VIP
        </div>
        <ol className="relative space-y-5 border-l border-orange/30 pl-4 text-sm text-gray-700 sm:text-base">
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">Antes de la sesión</p>
            <p className="text-gray-700">
              Dudas sobre si tu perfil sostiene una Green Card o solo una buena intención costosa.
            </p>
          </li>
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">Durante la sesión (60 minutos)</p>
            <p className="text-gray-700">
              Decisión binaria sobre tu ruta migratoria y hoja de ruta clara basada en evidencias.
            </p>
          </li>
          <li className="space-y-1">
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-orange" />
            <p className="font-semibold text-navy">Después de 90 días</p>
            <p className="text-gray-700">
              Ejecutando un plan concreto o ahorrándote un intento caro que no tenía sentido hoy.
            </p>
          </li>
        </ol>
      </div>
    </motion.section>
  )
}

