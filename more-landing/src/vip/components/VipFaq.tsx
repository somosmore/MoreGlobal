import { motion } from "framer-motion"
import { VipCtaButton } from "./VipCtaButton"

const DEFAULT_PAYMENT_LINK = "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"

const faqs = [
  {
    question: "¿Qué pasa si no califico para ninguna visa?",
    answer:
      "Te lo decimos con honestidad en la sesión y te orientamos sobre los próximos pasos más convenientes, aunque la respuesta hoy sea “todavía no”.",
  },
  {
    question: "¿La sesión es por videollamada?",
    answer:
      "Sí, la sesión es virtual, 1 a 1 con Ivon, por la plataforma que más te convenga.",
  },
  {
    question: "¿Recibiré algo después de la sesión?",
    answer:
      "Sí. Al finalizar, recibirás un PDF con tu ruta migratoria personalizada para los próximos 90 días.",
  },
  {
    question: "¿Qué es la EB-2 NIW?",
    answer:
      "Es una visa de residencia permanente para profesionales con habilidad excepcional o avanzada que benefician el interés nacional de EE.UU. No requiere empleador patrocinador.",
  },
  {
    question: "¿Cuándo podré agendar la sesión?",
    answer:
      "Inmediatamente después del pago recibirás un link para elegir el horario disponible en el calendario de Ivon.",
  },
] as const

type VipFaqProps = {
  calendarUrl?: string | null
  vipPaymentLink?: string | null
  loading?: boolean
}

const FaqItem = ({
  question,
  answer,
}: {
  question: string
  answer: string
}) => {
  return (
    <details className="group py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-navy">
        <span>{question}</span>
        <span className="text-xs text-gray-400 group-open:hidden">+</span>
        <span className="hidden text-xs text-gray-400 group-open:inline">−</span>
      </summary>
      <p className="mt-2 text-sm text-gray-600">{answer}</p>
    </details>
  )
}

export const VipFaq = ({ calendarUrl, vipPaymentLink, loading }: VipFaqProps) => {
  const ctaLabel = "Aplicar ahora"
  const effectivePaymentLink = vipPaymentLink || calendarUrl || DEFAULT_PAYMENT_LINK

  return (
    <motion.section
      className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
        Preguntas frecuentes
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Antes de agendar tu sesión, resuelve las dudas más comunes sobre cómo
        funciona la Asesoría VIP.
      </p>
      <div className="mt-4 divide-y divide-gray-200">
        {faqs.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>

      <div className="mt-6 max-w-xs">
        <VipCtaButton
          label={ctaLabel}
          calendarUrl={effectivePaymentLink}
          loading={loading}
          variant="secondary"
        />
      </div>
    </motion.section>
  )
}

