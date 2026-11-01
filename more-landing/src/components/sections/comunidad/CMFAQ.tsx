import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "¿La comunidad tiene algún costo?",
    a: "No. El acceso al grupo de Facebook es gratuito y no tiene costos ocultos.",
  },
  {
    q: "¿Por qué me piden mis datos?",
    a: "Para enviarte el acceso al grupo y avisarte de masterclasses y lives que se anuncian en la comunidad.",
  },
  {
    q: "¿Para quién es esta comunidad?",
    a: "Para profesionales, emprendedores e inversionistas que planean su camino a Estados Unidos y buscan información actualizada.",
  },
  {
    q: "¿Necesito una cuenta de Facebook?",
    a: "Sí. La comunidad vive en un grupo de Facebook. Al terminar el registro te llevamos al grupo para solicitar tu acceso.",
  },
  {
    q: "¿Recibiré asesoría legal personalizada?",
    a: "No. El grupo es un espacio educativo. Para analizar tu caso puedes agendar un diagnóstico con el equipo de MORE.",
  },
]

export default function CMFAQ() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">Preguntas</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-navy-deep sm:text-3xl">
            Todo claro antes de entrar.
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-8 w-full divide-y divide-navy/10 border-y border-navy/10">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`} className="border-0">
              <AccordionTrigger className="py-5 text-left text-sm font-semibold text-navy-deep hover:no-underline sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-ink-muted">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
