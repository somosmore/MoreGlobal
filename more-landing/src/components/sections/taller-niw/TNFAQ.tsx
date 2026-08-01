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
    a: "Para profesionales que están (o van a estar) en un proceso de cambio de estatus y necesitan prepararse con estrategia — antes de que un error o una demora les cuesten la residencia permanente.",
  },
  {
    q: "¿Necesito tener un caso de inmigración en curso?",
    a: "No. El taller te sirve si estás evaluando tu ruta, si ya iniciaste un proceso, o si sabés que se avecinan cambios y querés llegar preparado.",
  },
  {
    q: "¿El taller es realmente gratis?",
    a: "Sí, 100% gratuito. Es una sesión en vivo con guía práctica y estrategias concretas. No hay costos ocultos para asistir.",
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
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-navy-deep sm:text-3xl">
          Preguntas frecuentes
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`faq-${i}`}
              className="rounded-xl border border-navy/10 bg-white px-4"
            >
              <AccordionTrigger className="text-left text-navy-deep hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-ink-muted">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
