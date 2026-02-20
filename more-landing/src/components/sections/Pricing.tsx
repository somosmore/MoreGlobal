import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  Star,
  Send,
  MessageCircle,
  Video,
  Target,
  Network,
  Heart,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Unsung Professional Program",
    price: "$2,500",
    badge: "DIY",
    description:
      "Programa de autogestión para profesionales que quieren preparar su caso EB-2 NIW con guía experta paso a paso.",
    timeline: "90 – 120 días",
    features: [
      { text: "9 módulos completos", icon: BookOpen },
      { text: "4 talleres en vivo prácticos", icon: Video },
      { text: "4 sesiones de coaching 1 a 1", icon: Users },
      {
        text: "Guías para implementar el piloto de tu proyecto de interés nacional en 90 días y lograr evidencias reales",
        icon: Target,
      },
      { text: "Acceso a comunidad privada", icon: Users },
    ],
    cta: "Comenzar Programa",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Plan Plus",
    price: "$8,000",
    badge: "Premium",
    description:
      "Acompañamiento premium de principio a fin. Nosotros armamos tu expediente mientras tú sigues adelante con tu empresa, startup, formación académica o tu trabajo. Pensado para estudiantes, empresarios, emprendedores y trabajadores independientes.",
    timeline: "120 – 160 días",
    features: [
      { text: "Ordenamos, redactamos y diligenciamos documentos de tu expediente", icon: FileText },
      {
        text: "Elaboramos el Proyecto o Plan de negocios de interés nacional",
        icon: Target,
      },
      {
        text: "Guía y Agenda exploratoria de networking en USA para implementar tu proyecto, gestionar cartas y evidencias",
        icon: Network,
      },
      { text: "Consolidación y envío de expediente", icon: Send },
      { text: "Acceso a comunidad privada", icon: Users },
      { text: "Coach emocional durante el proceso", icon: Heart },
      { text: "Seguimiento post envío", icon: Eye },
    ],
    cta: "Solicitar Plan Plus",
    ctaVariant: "gold" as const,
    popular: true,
  },
];

export default function Pricing() {
  return (
    <section id="programas" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            Programas
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            Elige tu camino hacia la <span className="text-[#F37021]">Green Card</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Dos rutas diseñadas para diferentes niveles de acompañamiento. Ambas
            con la misma meta: tu aprobación.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F37021] to-[#D4611A] text-white text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3" />
                    Más Popular
                  </span>
                </div>
              )}

              <div
                className={`h-full rounded-3xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] text-white shadow-2xl ring-2 ring-[#F37021]/30"
                    : "bg-white/60 backdrop-blur-sm border border-gray-200/80 shadow-lg hover:shadow-xl"
                }`}
                style={
                  plan.popular
                    ? {}
                    : {
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(249,250,251,0.6) 100%)",
                        backdropFilter: "blur(20px)",
                      }
                }
              >
                {/* Badge & Name */}
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full ${
                      plan.popular
                        ? "bg-[#F37021]/20 text-[#F37021]"
                        : "bg-[#2A3A4A]/5 text-[#2A3A4A]/60"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold mt-3 ${
                    plan.popular ? "text-white" : "text-[#2A3A4A]"
                  }`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    plan.popular ? "text-white/60" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-6 mb-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.popular ? "text-white" : "text-[#2A3A4A]"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ml-2 ${
                      plan.popular ? "text-white/50" : "text-gray-400"
                    }`}
                  >
                    USD
                  </span>
                </div>

                {/* Timeline */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 ${
                    plan.popular
                      ? "bg-white/10"
                      : "bg-gray-100"
                  }`}
                >
                  <Clock
                    className={`w-4 h-4 ${
                      plan.popular ? "text-[#F37021]" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      plan.popular ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {plan.timeline}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      <feature.icon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.popular ? "text-[#F37021]" : "text-[#F37021]"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.popular ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.popular ? (
                  <Button variant="gold" className="w-full gap-2" size="lg" asChild>
                    <a
                      href="https://wa.me/15483122105?text=Hola%20MORE,%20me%20interesa%20el%20Plan%20Plus."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {plan.cta}
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full gap-2"
                    size="lg"
                    asChild
                  >
                    <a
                      href="https://wa.me/15483122105?text=Hola%20MORE,%20me%20interesa%20el%20programa%20Unsung."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plan.cta}
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
