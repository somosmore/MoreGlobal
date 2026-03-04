import { motion } from "framer-motion"
import { Briefcase, Store, GraduationCap, TrendingUp, ArrowRight } from "lucide-react"

const profiles = [
  {
    icon: Briefcase,
    title: "Profesionales Graduados",
    tags: ["Médicos", "Ingenieros", "Investigadores", "Abogados"],
    description: "Tu título y trayectoria son más poderosos de lo que crees. Con la estrategia correcta, se convierten en tu residencia.",
    proof: "Carlos, médico venezolano — EB-2 NIW aprobada en 4 meses sin patrocinador.",
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    tagStyle: "bg-blue-50 text-blue-700",
    proofBg: "bg-blue-50/80",
    proofColor: "text-blue-700",
  },
  {
    icon: Store,
    title: "Empresarios y Comerciantes",
    tags: ["Dueños de negocio", "Emprendedores", "Importadores", "Franquiciados"],
    description: "Tu empresa y tu impacto económico hablan por ti. Los convertimos en el expediente que necesitas.",
    proof: "Ana, empresaria colombiana — Green Card mientras seguía operando su negocio.",
    borderColor: "border-l-[#F37021]",
    iconBg: "bg-orange-50",
    iconColor: "text-[#F37021]",
    tagStyle: "bg-orange-50 text-orange-700",
    proofBg: "bg-orange-50/80",
    proofColor: "text-orange-700",
  },
  {
    icon: GraduationCap,
    title: "Profesionales Especializados",
    tags: ["Técnicos", "Consultores", "Diseñadores", "+10 años experiencia"],
    description: "La experiencia sostenida en tu campo tiene un valor migratorio enorme. Solo hay que saber presentarla.",
    proof: "Jorge, diseñador industrial con 12 años de carrera — calificó sin maestría.",
    borderColor: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    tagStyle: "bg-violet-50 text-violet-700",
    proofBg: "bg-violet-50/80",
    proofColor: "text-violet-700",
  },
  {
    icon: TrendingUp,
    title: "Inversionistas",
    tags: ["Capital privado", "Bienes raíces", "Startups", "Portafolio activo"],
    description: "Tu capital activo en EE.UU. abre rutas migratorias directas. Te ayudamos a elegir la correcta.",
    proof: "Roberto, inversionista peruano — E-2 aprobada y roadmap hacia Green Card en 18 meses.",
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    tagStyle: "bg-emerald-50 text-emerald-700",
    proofBg: "bg-emerald-50/80",
    proofColor: "text-emerald-700",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

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
            ¿Cuál de estos perfiles{" "}
            <span className="text-[#F37021]">eres tú?</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Si te ves en alguno de estos perfiles, ya tienes más de lo que crees para lograrlo.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        >
          {profiles.map((profile) => (
            <motion.div key={profile.title} variants={cardVariants}>
              <div className={`group h-full bg-white border border-gray-200/80 border-l-4 ${profile.borderColor} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col`}>

                {/* Icon + Title + Tags */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl ${profile.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <profile.icon className={`w-7 h-7 ${profile.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-[#2A3A4A] leading-snug">
                      {profile.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${profile.tagStyle}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-[15px] leading-relaxed flex-1">
                  {profile.description}
                </p>

                {/* Micro proof */}
                <div className={`mt-5 px-4 py-3 rounded-xl ${profile.proofBg}`}>
                  <p className={`text-xs font-medium ${profile.proofColor} leading-relaxed`}>
                    <span className="opacity-60 mr-1">Caso real →</span>
                    {profile.proof}
                  </p>
                </div>

                {/* Self-selection CTA */}
                <a
                  href="#quiz"
                  tabIndex={0}
                  aria-label={`Evaluar mi perfil como ${profile.title}`}
                  className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold ${profile.iconColor} hover:gap-3 transition-all duration-200`}
                >
                  Este soy yo — evaluar mi perfil
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge → Quiz */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-sm text-gray-500 mt-14 font-medium"
        >
          ¿Te identificas? Descubre en 3 preguntas si tu perfil califica hoy.
        </motion.p>
      </div>
    </section>
  )
}
