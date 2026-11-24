import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WV_FAQ } from "./webinarVipRfeCopy"

export function WVFAQ() {
  return (
    <section className="bg-[#F4F6FB] py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-4 sm:px-6"
      >
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-orange-dark">Preguntas frecuentes</p>
        <Accordion type="single" collapsible className="mt-6 space-y-2">
          {WV_FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-xl border border-navy/10 bg-white px-4">
              <AccordionTrigger className="text-left text-sm font-semibold text-navy-deep">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-ink-muted">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}

export function WVSpeaker() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-5 border border-navy/10 bg-paper p-6 sm:flex-row sm:p-8">
          <img src="/ivon.png" alt="Ivon More" className="h-24 w-24 shrink-0 rounded-full border-4 border-[#F37021]/20 object-cover" />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-navy-deep">Ivon More</h3>
            <p className="mt-1 text-sm font-semibold text-orange-dark">
              Fundadora de MORE y del Instituto More de Educación Migratoria
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Acompaña cada semana a clientes en todas las etapas del proceso, desde el primer
              expediente hasta la respuesta a un RFE. En este webinar comparte lo que está viendo
              en los casos de hoy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function WVFooter() {
  return (
    <footer className="border-t border-white/10 bg-navy-deep px-4 py-8 text-center">
      <p className="text-sm text-white/70">MORE — Migración con Propósito</p>
      <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/50">
        Este webinar es orientación educativa: no constituye asesoría legal ni garantiza
        resultados. La decisión de cada caso es de USCIS y del Departamento de Estado.
      </p>
      <p className="mt-3 text-xs text-white/40">© {new Date().getFullYear()} MORE. Todos los derechos reservados.</p>
    </footer>
  )
}
