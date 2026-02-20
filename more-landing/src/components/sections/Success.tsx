import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Briefcase,
  Stethoscope,
  TrendingUp,
  Scale,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ivonData = {
  name: "Ivon MORE",
  title: "Abogada & Fundadora",
  expertise: "Experta en Gestión de Proyectos Sociales",
  description:
    "Con más de una década de experiencia en inmigración estratégica, Ivon ha guiado a cientos de profesionales latinoamericanos en la obtención de su residencia permanente a través de la visa EB-2 NIW. Su enfoque único combina expertise legal con gestión de proyectos de alto impacto.",
  stats: [
    { value: "200+", label: "Casos Aprobados" },
    { value: "98%", label: "Tasa de Éxito" },
    { value: "10+", label: "Años de Experiencia" },
  ],
};

type SuccessCase = {
  name: string;
  country?: string;
  role: string;
  area: string;
  icon: typeof Briefcase;
  quote: string;
  timeline: string;
  photo?: string;
};

const successCases: SuccessCase[] = [
  {
    name: "Ricardo Ochoa",
    country: "Colombia",
    role: "Profesional",
    area: "Consultoría",
    icon: User,
    quote:
      "La confianza que brinda Ivon y su equipo, además de su experiencia en EB-2 NIW, fue lo que más me impactó. Afiancé que puedo aportar mucho al progreso de EE.UU.",
    timeline: "Aprobado en 120 días",
    photo: "/testimonials/ricardo-ochoa.jpg",
  },
  {
    name: "Carlos M.",
    role: "Ingeniero de Software",
    area: "STEM & Tecnología",
    icon: Briefcase,
    quote:
      "MORE transformó mi perfil en una narrativa de impacto nacional. En 4 meses tenía mi aprobación. El proceso fue claro y estratégico desde el día uno.",
    timeline: "Aprobado en 120 días",
  },
  {
    name: "Dra. María L.",
    role: "Médica Investigadora",
    area: "Salud & Medicina",
    icon: Stethoscope,
    quote:
      "El equipo me ayudó a construir un plan profesional que demostró mi impacto en salud pública de manera contundente.",
    timeline: "Aprobada en 95 días",
  },
  {
    name: "Roberto S.",
    role: "Emprendedor Social",
    area: "Negocios & Impacto",
    icon: TrendingUp,
    quote:
      "Sin oferta de empleo, pensé que era imposible. MORE demostró que mi trayectoria empresarial era suficiente para la EB-2 NIW.",
    timeline: "Aprobado en 140 días",
  },
  {
    name: "Más testimonios próximamente",
    role: "Perfil adicional",
    area: "MORE",
    icon: User,
    quote:
      "Continuamos sumando casos de éxito de empresarios, profesionales e inversionistas que lograron su residencia permanente con nosotros.",
    timeline: "Aprobaciones en curso",
  },
];

export default function Success() {
  const [activeCase, setActiveCase] = useState(0);

  const nextCase = () => {
    setActiveCase((prev) => (prev + 1) % successCases.length);
  };

  const prevCase = () => {
    setActiveCase(
      (prev) => (prev - 1 + successCases.length) % successCases.length
    );
  };

  return (
    <section id="exito" className="py-24 sm:py-32 bg-gray-50/50">
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
            Casos de éxito
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            Resultados que hablan por sí solos
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Profesionales reales, aprobaciones reales. Conoce a quienes ya
            construyeron su legado en EE.UU.
          </p>
        </motion.div>

        {/* Ivon Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E]">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Info */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-5 h-5 text-[#F37021]" />
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#F37021]">
                      Liderazgo
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {ivonData.name}
                  </h3>
                  <p className="text-white/50 text-sm font-medium mb-1">
                    {ivonData.title}
                  </p>
                  <p className="text-[#F37021] text-sm font-medium mb-6">
                    {ivonData.expertise}
                  </p>
                  <p className="text-white/70 text-[15px] leading-relaxed mb-8">
                    {ivonData.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {ivonData.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-[#F37021]">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Visual */}
                <div className="relative bg-gradient-to-br from-[#F37021]/10 to-[#2A3A4A] flex items-center justify-center p-12 min-h-[300px]">
                  <div className="text-center">
                    <img
                      src="/logo_more_dark.png"
                      alt="MORE Logo"
                      className="w-50 mx-auto mb-6 opacity-80"
                    />
                    <p className="text-white/40 text-sm italic">
                      "Cada profesional tiene una historia extraordinaria. <br />
                      Nosotros la hacemos visible."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Cases Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-0 shadow-xl overflow-hidden">
                  <CardContent className="p-8 sm:p-10">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] flex items-center justify-center mb-4 shrink-0">
                        {successCases[activeCase].photo && (
                          <img
                            src={successCases[activeCase].photo}
                            alt={successCases[activeCase].name}
                            className="absolute inset-0 w-full h-full object-cover z-10"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        {(() => {
                          const IconComp = successCases[activeCase].icon;
                          return <IconComp className="w-8 h-8 text-[#F37021] relative z-0" />;
                        })()}
                      </div>
                      <h4 className="font-bold text-[#2A3A4A] text-lg">
                        {successCases[activeCase].name}
                      </h4>
                      {successCases[activeCase].country && (
                        <p className="text-sm text-gray-500 mt-1">
                          {successCases[activeCase].country}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {successCases[activeCase].role}
                      </p>
                    </div>
                    <Quote className="w-8 h-8 text-[#F37021]/20 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg leading-relaxed mb-6 italic">
                      &ldquo;{successCases[activeCase].quote}&rdquo;
                    </p>
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        {successCases[activeCase].timeline}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevCase}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex gap-2">
                {successCases.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCase(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeCase
                        ? "w-8 bg-[#F37021]"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextCase}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
