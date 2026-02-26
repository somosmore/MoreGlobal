import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Qué requisitos debo cumplir para aplicar a la visa EB-2 NIW?",
    answer:
      "Debes cumplir los criterios Matter of Dhanasar: (1) Tu propuesta de trabajo tiene mérito sustancial e importancia nacional; (2) Estás bien posicionado para avanzar la propuesta; y (3) Sería beneficioso para EE.UU. eximir el requisito de oferta de empleo. Además, necesitas título de licenciatura o equivalente (maestría o experiencia laboral equivalente).",
  },
  {
    question: "¿Necesito una oferta de empleo para la EB-2 NIW?",
    answer:
      "No. La categoría National Interest Waiver (NIW) es precisamente una exención del requisito de oferta de empleo. Debes demostrar que tu trabajo beneficia al interés nacional de EE.UU., lo que elimina la necesidad de un empleador patrocinador. Esto te da libertad para emprender o trabajar donde desees.",
  },
  {
    question: "¿Qué pasa si no tengo maestría?",
    answer:
      "Puedes calificar mediante equivalencia de títulos. Si tienes licenciatura más al menos 5 años de experiencia laboral progresiva post-grado, puedes solicitar una evaluación de titulus y experiencia laboral. La equivalencia demuestra que tu formación y experiencia son equivalentes a una maestría estadounidense.",
  },
  {
    question: "¿Soy empresario, ¿qué evidencias puedo usar para certificación laboral?",
    answer:
      "Los empresarios pueden utilizar: facturas de servicios profesionales, contratos con clientes o proveedores, registros de empleados, certificados de cámara de comercio, licencias, publicidad, cobertura en medios, premios empresariales, declaraciones de impuestos y estados financieros. Si tu empresa ya no existe, aún puedes usar documentación histórica que pruebe tu rol y aporte",
  },
  {
    question: "¿A quiénes puedo incluir en mi proceso? (cónyuge, hijos)",
    answer:
      "Puedes incluir a tu cónyuge legalmente casado y a tus hijos menores de 21 años al momento de la solicitud. Todos recibirán residencia permanente derivada de tu aprobación. Los hijos deben permanecer solteros para mantener el beneficio.",
  },
  {
    question: "¿Cuánto cuesta la equivalencia de títulos?",
    answer:
      "Las evaluaciones de equivalencia tienen costos variables según el proveedor. Un proceso completo puede rondar aproximadamente USD 400, mientras que evaluaciones más básicas pueden costar alrededor de USD 85. Te orientamos sobre la opción más adecuada para tu caso.",
  },
  {
    question: "¿Los documentos deben estar apostillados?",
    answer:
      "En general, no es requisito apostillar los documentos académicos para la EB-2 NIW. USCIS acepta traducciones certificadas y copias. Te guiamos en la organización correcta de tu expediente según los lineamientos actuales.",
  },
  {
    question: "¿Puedo aplicar si vivo fuera de Estados Unidos?",
    answer:
      "Sí, absolutamente. La petición EB-2 NIW se puede presentar desde cualquier país. No necesitas estar físicamente en EE.UU. para iniciar el proceso. Una vez aprobada, puedes completar el proceso consular desde tu país de residencia.",
  },
  {
    question: "¿Cuánto tiempo toma el proceso completo?",
    answer:
      "Con nuestro Plan Plus, el tiempo promedio de preparación es de 120 a 160 días. Para el programa Unsung, el tiempo es de 90 a 120 días. Una vez enviada la petición, USCIS tarda entre 13 y 24 meses en dar una respuesta, aunque con el Premium Processing este plazo se puede reducir a 45 días.",
  },
  {
    question: "¿Qué documentos académicos necesito?",
    answer:
      "Necesitas títulos, diplomas, certificados y transcripciones. Las traducciones deben ser certificadas al inglés. Te guiamos en qué enviar según tu país de estudio y cómo organizar el expediente de forma clara para USCIS.",
  },
  {
    question: "¿Si estoy en unión libre, debo casarme para incluir a mi pareja?",
    answer:
      "Sí. Para incluir a tu pareja como beneficiario derivado en la EB-2 NIW necesitas estar legalmente casado. La unión libre no es reconocida por USCIS para este fin. Si planeas incluir a tu pareja, deberás contraer matrimonio legal antes de presentar la solicitud.",
  },
  {
    question: "¿Qué pasa si no tengo publicaciones académicas?",
    answer:
      "Las publicaciones son solo uno de los criterios posibles. También se valoran premios, membresías profesionales, liderazgo en organizaciones, contribuciones originales en tu campo, cobertura en medios y salarios altos. Trabajamos contigo para identificar y potenciar tus fortalezas.",
  },
  {
    question: "¿Qué diferencia hay entre el programa UPP y el Plan Plus?",
    answer:
      "Con el programa Unsung (UPP), obtienes las herramientas, plantillas y el coaching necesario para gestionar tu propio caso. Si buscas una solución completa, nuestro Plan Plus suma la elaboración de tu plan profesional, redacción de testimonios y gestión integral. Es la alternativa perfecta para quienes prefieren delegar la ejecución técnica y asegurar cada detalle.",
  },
];

export default function Footer() {
  return (
    <>
      {/* FAQ Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#F37021]">
              Preguntas frecuentes
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[#2A3A4A] tracking-tight">
              Resolvemos tus dudas
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Las preguntas más comunes sobre el proceso de visa EB-2 NIW.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-left text-[#2A3A4A] font-medium text-[15px] py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-[15px] leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 bg-gradient-to-r from-[#2A3A4A] to-[#3A4D5E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[#F37021]/[0.05] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[#F37021]/[0.03] blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tu futuro en EE.UU. comienza hoy
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Agenda una evaluación gratuita de tu perfil y descubre si
              calificas para la visa EB-2 NIW.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gold" size="lg" className="gap-2" asChild>
                <a
                  href="https://wa.me/15483122105?text=Hola%20MORE,%20quiero%20evaluar%20mi%20perfil%20para%20la%20EB-2%20NIW."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4" />
                  Evaluar mi Perfil Gratis
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A3A4A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo_more_dark.png"
                  alt="MORE Logo"
                  className="h-40 w-40"
                />
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Consultora especializada en visas y migración EB-2 NIW. Ayudamos a
                empresarios, comerciantes, profesionales e inversionistas a lograr
                su residencia permanente y Green Card en EE.UU.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Metodología", href: "#metodologia" },
                  { label: "¿A quién ayudamos?", href: "#quienes-ayudamos" },
                  { label: "Programas", href: "#programas" },
                  { label: "Casos de Éxito", href: "#exito" },
                  { label: "Evaluar mi Perfil", href: "#quiz" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/40 hover:text-[#F37021] text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Contacto
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <Mail className="w-4 h-4 text-[#F37021]" />
                  soporte@justmore.net
                </li>
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <MessageCircle className="w-4 h-4 text-[#F37021]" />
                  +1 (548) 312-2105
                </li>
                <li className="flex items-start gap-3 text-white/40 text-sm">
                  <MapPin className="w-4 h-4 text-[#F37021] mt-0.5" />
                  4538 Bagley Garden Ct, Katy TX 77449, United States
                </li>
                <li className="flex items-center gap-3 text-white/40 text-sm">
                  <Instagram className="w-4 h-4 text-[#F37021]" />
                  <a
                    href="https://instagram.com/somos.more"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#F37021] transition-colors"
                  >
                    @somos.more
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © {new Date().getFullYear()} MORE Immigration Consulting. Todos los
              derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                Términos & Condiciones
              </a>
              <a
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
