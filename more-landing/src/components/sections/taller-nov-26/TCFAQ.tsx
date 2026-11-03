import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿Es presencial o virtual?",
    a: "Es 100% virtual y en vivo. Lo ves desde donde estés: Colombia, otro país o Estados Unidos. Te enviamos el acceso por email y WhatsApp antes del taller.",
  },
  {
    q: "¿Mi perfil alcanza para migrar o crecer en EE.UU.?",
    a: "Justamente para eso es el taller: en el primer módulo identificas tu punto de partida real y qué rutas tienen sentido para tu perfil. Muchos profesionales que creen que no califican sí tienen opciones.",
  },
  {
    q: "¿Qué diferencia hay entre General y VIP?",
    a: "Las dos incluyen el taller completo y el material. VIP suma beneficios adicionales; revisa el detalle en cada entrada.",
  },
  {
    q: "¿Necesito tener una visa o un proceso iniciado?",
    a: "No. El taller es para cualquier persona que quiera entender su ruta, esté o no en proceso.",
  },
  {
    q: "¿Qué pasa si no puedo asistir en vivo?",
    a: "Te recomendamos conectarte en vivo para la ronda de preguntas. La entrada VIP incluye la grabación del taller.",
  },
  {
    q: "¿Puedo pedir reembolso?",
    // TODO(confirmar con el equipo): política de reembolso o cambio de fecha.
    a: "Escríbenos por WhatsApp antes del taller y revisamos tu caso.",
  },
  {
    q: "¿El taller garantiza mi visa?",
    a: "No. Es un taller educativo, no constituye asesoría legal ni garantiza resultados. Cada caso depende del perfil y de la decisión de las autoridades.",
  },
]

export default function TCFAQ() {
  return (
    <section className="bg-[#F4F6FB] py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">
          Preguntas frecuentes
        </p>
        <h2 className="mb-8 mt-3 text-center font-display text-2xl font-bold text-navy-deep sm:text-3xl">
          Antes de reservar
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
              <AccordionContent className="text-ink-muted">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
