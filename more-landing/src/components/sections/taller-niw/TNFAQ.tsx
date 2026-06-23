import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿Para quién es este taller?",
    a: "Para cualquier persona que esté pensando en contratar (o ya contrató) a un abogado de inmigración y quiera evitar estafas, cobros injustificados y errores que pueden costarle su caso.",
  },
  {
    q: "¿Necesito tener un caso de inmigración en curso?",
    a: "No. El taller te sirve tanto si apenas estás evaluando empezar tu proceso como si ya estás trabajando con un abogado y quieres saber si lo está haciendo bien.",
  },
  {
    q: "¿El taller es realmente gratis?",
    a: "Sí, 100% gratuito. Es una sesión en vivo donde compartimos información real y accionable. No hay costos ocultos para asistir.",
  },
  {
    q: "¿Quedará grabado?",
    a: "La sesión es en vivo y no garantizamos la disponibilidad de la grabación. Te recomendamos asistir en tiempo real para aprovechar la sesión de preguntas y respuestas.",
  },
]

export default function TNFAQ() {
  return (
    <section className="py-10 sm:py-12 bg-[#F4F6FB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2340] text-center mb-6">
          Preguntas frecuentes
        </h2>

        <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 sm:p-8">
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-[#1A2340] text-sm sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#6B7A9A] text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.div>
    </section>
  )
}
