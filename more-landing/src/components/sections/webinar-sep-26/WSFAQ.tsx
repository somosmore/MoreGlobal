import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿Tengo que hacer las 7 masterclasses?",
    a: "No. La Masterclass 1 es una clase completa en sí misma. Las siguientes se anuncian en el grupo de WhatsApp y decides libremente a cuáles entrar.",
  },
  {
    q: "¿Es una clase de visas?",
    a: "No. Es la clase de contexto: cómo funciona hoy el sistema migratorio de EE.UU., qué cambió y cómo leer ese panorama. El mapa de visas es la Masterclass 3.",
  },
  {
    q: "¿Para quién es esta masterclass?",
    a: "Para profesionales que están planificando su camino a EE.UU. y no quieren decidir con información desactualizada o con rumores de redes sociales.",
  },
  {
    q: "¿Sirve si ya tengo abogado?",
    a: "Sí. Llegas con contexto y preguntas más precisas. No reemplaza asesoría legal personalizada; te da criterio para conversar mejor.",
  },
  {
    q: "¿La masterclass es realmente gratis?",
    a: "Sí, 100% gratuita. Es una sesión en vivo. No hay costos ocultos para asistir.",
  },
  {
    q: "¿Quedará grabada?",
    a: "La sesión es en vivo y no garantizamos la disponibilidad de la grabación. Te recomendamos asistir en tiempo real para la ronda de preguntas.",
  },
]

export default function WSFAQ() {
  return (
    <section className="bg-[#F4F6FB] py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
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
