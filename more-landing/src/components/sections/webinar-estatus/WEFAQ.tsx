import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿Es una clase de visas?",
    a: "No. No memorizamos catálogos. Te enseñamos a leer tu propia historia migratoria: I-94, D/S, visa vs estatus, y qué cambia cuando cambia tu situación.",
  },
  {
    q: "¿Para quién es este webinar?",
    a: "Para quien está (o planea estar) en EE.UU. con un estatus y quiere dejar de operar a ciegas: entender qué está autorizado a hacer, por cuánto tiempo, y qué significan los cambios.",
  },
  {
    q: "¿Necesito tener documentos a mano?",
    a: "No es obligatorio, pero ayuda tener a mano tu I-94 o la información de tu última admisión. Así las preguntas en vivo son más precisas.",
  },
  {
    q: "¿Sirve si ya tengo abogado?",
    a: "Sí. Llegás con un marco claro y preguntas más específicas. No reemplaza asesoría legal personalizada; te da claridad para conversar mejor.",
  },
  {
    q: "¿El webinar es realmente gratis?",
    a: "Sí, 100% gratuito. Es una sesión en vivo. No hay costos ocultos para asistir.",
  },
  {
    q: "¿Quedará grabado?",
    a: "La sesión es en vivo y no garantizamos la disponibilidad de la grabación. Te recomendamos asistir en tiempo real para la ronda de preguntas.",
  },
]

export default function WEFAQ() {
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
