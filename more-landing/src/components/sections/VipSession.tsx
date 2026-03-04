import { motion } from "framer-motion"
import { Shield, Clock, CheckCircle, CalendarDays, Star } from "lucide-react"
import { useSiteSettings } from "@/hooks/useSiteSettings"

const deliverables = [
  "Evaluación real de tu elegibilidad EB-2 NIW — sin eufemismos",
  "Los 3 obstáculos específicos de tu perfil y cómo superarlos",
  "Tu hoja de ruta personalizada para los próximos 90 días",
  "Recomendación clara: qué programa es el correcto para ti (o si todavía no es el momento)",
]

export default function VipSession() {
  const { settings, loading } = useSiteSettings()
  const calendlyUrl = settings.calendar_url

  return (
    <section id="asesoria-vip" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Card */}
            <div className="relative rounded-3xl border-2 border-[#F37021]/30 bg-gradient-to-br from-[#FFF8F4] to-white shadow-2xl overflow-hidden">
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#F37021] to-[#D4611A]" />

              <div className="px-8 sm:px-12 py-10 sm:py-12">
                {/* Eyebrow */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F37021]/10 text-[#F37021] text-xs font-semibold uppercase tracking-widest">
                    <Star className="w-3 h-3" />
                    Primer paso
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                    <Clock className="w-3 h-3" />
                    Cupos limitados por semana
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2A3A4A] leading-tight tracking-tight mb-4">
                  ¿Tu perfil califica para la Green Card?{" "}
                  <span className="text-[#F37021]">
                    Descúbrelo antes de invertir un solo dólar más.
                  </span>
                </h2>

                {/* Subheadline */}
                <p className="text-gray-600 text-base leading-relaxed mb-8">
                  En 60 minutos con Ivon analizamos tu caso, identificamos tus fortalezas reales
                  y te damos la hoja de ruta exacta para los próximos 90 días — sin rodeos,
                  sin promesas vacías.
                </p>

                {/* Deliverables */}
                <ul className="space-y-3 mb-8">
                  {deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#F37021] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-gray-100 my-8" />

                {/* Price + session info */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-[#2A3A4A]">$97</span>
                      <span className="text-gray-400 text-base font-medium">USD</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Sesión 1 a 1 · 60 minutos con Ivon
                      </span>
                    </div>
                  </div>

                  {/* Guarantee badge */}
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-100 sm:max-w-[220px]">
                    <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 leading-snug font-medium">
                      Si en los primeros 15 min vemos que no podemos ayudarte, te devolvemos el
                      dinero. Sin preguntas.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                {loading ? (
                  <div className="h-14 w-full rounded-2xl bg-gray-100 animate-pulse" />
                ) : calendlyUrl ? (
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl
                      bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white font-bold text-base
                      shadow-lg shadow-[#F37021]/30 hover:shadow-xl hover:shadow-[#F37021]/40
                      hover:from-[#D4611A] hover:to-[#C05010] transition-all duration-200
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                    aria-label="Agendar Asesoría VIP con Ivon — $97 USD"
                  >
                    <CalendarDays className="w-5 h-5 shrink-0" />
                    Sí, quiero evaluar mi perfil con Ivon — $97 USD
                  </a>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl
                      bg-gray-200 text-gray-400 font-bold text-base cursor-not-allowed"
                    aria-label="Próximamente disponible"
                  >
                    <CalendarDays className="w-5 h-5 shrink-0" />
                    Próximamente disponible
                  </button>
                )}

                {/* Value contrast */}
                <p className="text-center text-xs text-gray-400 mt-4 italic">
                  Una hora que puede ahorrarte meses de decisiones equivocadas — y miles de
                  dólares invertidos en el camino equivocado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
