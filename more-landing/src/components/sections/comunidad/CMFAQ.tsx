import { motion } from "framer-motion"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿La comunidad tiene algún costo?",
    a: "No. El acceso al grupo de Facebook es 100% gratuito y no tiene costos ocultos.",
  },
  {
    q: "¿Por qué me piden mis datos antes de entrar?",
    a: "Para avisarte por WhatsApp y email de las masterclasses y lives que anunciamos en la comunidad, y para que no te pierdas nada aunque no revises Facebook a diario.",
  },
  {
    q: "¿Para quién es esta comunidad?",
    a: "Para profesionales, emprendedores e inversionistas que están planificando su camino a Estados Unidos y quieren decidir con información actualizada.",
  },
  {
    q: "¿Necesito tener una cuenta de Facebook?",
    a: "Sí. La comunidad vive en un grupo de Facebook. Al terminar el registro te llevamos directo al grupo para que solicites tu acceso.",
  },
  {
    q: "¿Recibiré asesoría legal personalizada en el grupo?",
    a: "No. El grupo es un espacio educativo. Si quieres un análisis de tu caso, puedes agendar un diagnóstico con el equipo de MORE.",
  },
  {
    q: "¿Puedo salir cuando quiera?",
    a: "Claro. Puedes abandonar el grupo en cualquier momento y darte de baja de nuestros mensajes cuando lo desees.",
  },
]

export default function CMFAQ() {
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
