import { motion } from "framer-motion";
import { Briefcase, Store, GraduationCap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const profiles = [
  {
    icon: Briefcase,
    title: "Profesionales graduados",
    description:
      "Médicos, ingenieros e investigadores: transformen su carrera obteniendo la Green Card a través de su impacto social y de interés nacional.",
  },
  {
    icon: Store,
    title: "Comerciantes y Empresarios",
    description:
      "Dueños de negocios, emprendedores y empresarios con trayectoria comprobada que desean migrar a EE.UU. y expandir su impacto.",
  },
  {
    icon: GraduationCap,
    title: "Profesionales especializados",
    description:
      "Trabajamos con profesionales y técnicos de todas las áreas que cuenten con habilidades especiales o más de 10 años de experiencia destacada en su sector."
  },
  {
    icon: TrendingUp,
    title: "Inversionistas",
    description:
      "Inversionistas y emprendedores que buscan visas para no inmigrante o residencia permanente basada en su aporte económico y profesional.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function WhoWeHelp() {
  return (
    <section id="quienes-ayudamos" className="py-24 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
            ¿A quién ayudamos?
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            Perfiles que transformamos en{" "}
            <span className="text-[#F37021]">Residencia Permanente</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
          Asesoramos a empresarios, comerciantes, profesionales e inversionistas que buscan obtener la Green Card en los Estados Unidos. Además, brindamos acompañamiento en procesos de visas de no inmigrante según el caso.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {profiles.map((profile) => (
            <motion.div key={profile.title} variants={cardVariants}>
              <Card className="h-full border border-gray-200/80 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-6 sm:p-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F37021]/15 to-[#F37021]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <profile.icon className="w-6 h-6 text-[#F37021]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2A3A4A] mb-2">
                    {profile.title}
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    {profile.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge → Success */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-500 mt-14 font-medium"
        >
          ¿Te ves reflejado? Mira lo que logramos con perfiles como el tuyo.
        </motion.p>
      </div>
    </section>
  );
}
