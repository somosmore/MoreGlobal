import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-[#2A3A4A]/[0.03]">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#F37021]/[0.04] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#2A3A4A]/[0.03] blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="badge-shine inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A3A4A]/[0.05] border border-[#2A3A4A]/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#F37021] animate-pulse" />
            <span className="text-xs font-medium text-[#2A3A4A]/70 tracking-wide uppercase">
              Migración con propósito
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2A3A4A] leading-[1.1] tracking-tight"
          >
            ¿Es tu talento suficiente para la{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-[#F37021] to-[#D4611A] bg-clip-text text-transparent">
                Residencia Permanente
              </span>
            </span>{" "}
            en EE.UU.?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Transformamos tu trayectoria en un Plan de Alto Impacto. No solo
            tramitamos visas; construimos tu{" "}
            <strong className="text-[#2A3A4A] font-semibold">legado en Estados Unidos</strong>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" variant="gold" className="group" asChild>
              <a href="#quiz">
                Descargar Blueprint 2026
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" className="group" asChild>
              <a href="#programas">
                <Play className="mr-2 h-4 w-4" />
                Ver Plan Acelerador
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-gray-400"
          >
            <span className="font-medium text-[#2A3A4A]/70">Empresarios, profesionales e inversionistas</span>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>+200 profesionales aprobados</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <span>98% tasa de aprobación</span>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <span>Sin oferta de empleo requerida</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
