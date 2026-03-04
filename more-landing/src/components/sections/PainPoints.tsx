import { motion } from "framer-motion";
import { ShieldAlert, FileSearch, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  {
    icon: ShieldAlert,
    title: "Incertidumbre Burocrática",
    description:
      "El proceso migratorio está lleno de regulaciones confusas, tiempos inciertos y cambios de políticas. Sin guía experta, tu caso puede quedar estancado indefinidamente.",
    color: "from-red-500/15 to-red-500/5",
    iconColor: "text-red-500",
    borderColor: "hover:border-red-200",
  },
  {
    icon: FileSearch,
    title: "Falta de Estrategia Técnica",
    description:
      "Muchos asesores tramitan la visa sin un plan estratégico real. Tu petición necesita un método poderoso que demuestre tu impacto nacional, no solo un formulario bien llenado.",
    color: "from-blue-600/15 to-blue-600/5",
    iconColor: "text-blue-600",
    borderColor: "hover:border-blue-200",
  },
  {
    icon: UserX,
    title: "El Profesional Olvidado",
    description:
      "Tienes años de experiencia, logros reales y un futuro brillante, pero nadie te ha enseñado a presentar tu perfil como lo que realmente es: extraordinario.",
    color: "from-[#2A3A4A]/15 to-[#2A3A4A]/5",
    iconColor: "text-[#2A3A4A]",
    borderColor: "hover:border-[#2A3A4A]/20",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function PainPoints() {
  return (
    <section id="metodologia" className="py-24 sm:py-32 bg-white">
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
            El problema
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            ¿Por qué tantos profesionales fallan en su proceso?
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Estos son los 3 obstáculos que sabotean tu camino hacia la <span className="text-[#F37021] font-semibold">Green Card</span>.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {painPoints.map((point) => (
            <motion.div key={point.title} variants={cardVariants}>
              <Card className={`h-full border shadow-lg hover:shadow-xl transition-all duration-300 group ${point.borderColor}`}>
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <point.icon className={`w-6 h-6 ${point.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2A3A4A] mb-3">
                    {point.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-[15px]">
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge → WhoWeHelp */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-500 mt-14 font-medium"
        >
          Si te identificaste con alguno de estos problemas, probablemente eres exactamente el perfil que transformamos.
        </motion.p>
      </div>
    </section>
  );
}
