import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿Necesito tener un título universitario para aplicar a la EB2-NIW?",
    a: "Sí, la visa EB2-NIW requiere al menos un título de maestría (o su equivalente) o un título de licenciatura con al menos 5 años de experiencia progresiva en tu campo. En la masterclass te explicamos exactamente cómo evaluar si calificas.",
  },
  {
    q: "¿Necesito una oferta de trabajo o un empleador en EE.UU.?",
    a: "No. Esa es precisamente la ventaja de la EB2-NIW: puedes auto-peticionarte sin necesidad de un empleador que te patrocine. Te explicamos el proceso completo en las 3 sesiones.",
  },
  {
    q: "¿La masterclass es realmente gratis?",
    a: "Sí, 100% gratuita. Son 3 sesiones en vivo donde compartimos información real y accionable. No hay costos ocultos para asistir.",
  },
  {
    q: "¿Quedará grabada?",
    a: "Las sesiones son en vivo y no garantizamos la disponibilidad de las grabaciones. Te recomendamos asistir en tiempo real para aprovechar las sesiones de preguntas y respuestas.",
  },
]

export default function MCFAQ() {
  return (
    <section className="py-16 sm:py-20 bg-[#F8F9FC]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2340] text-center mb-8">
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
