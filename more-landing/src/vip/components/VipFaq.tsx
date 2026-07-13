import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"
import { SectionHeading } from "@/components/brand/SectionHeading"

type FaqEntry = {
  question: string
  answer: string
}

type VipFaqProps = {
  paymentLink: string
  loading?: boolean
}

const FaqItem = ({ question, answer }: FaqEntry) => (
  <details className="group rounded-2xl border border-navy/12 bg-white/80 px-5 py-4 backdrop-blur-sm transition-colors open:border-orange/40 sm:px-6">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-sm font-semibold text-navy sm:text-[15px]">
      <span>{question}</span>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-deep text-white transition-colors group-open:bg-orange">
        <Plus className="h-4 w-4 group-open:hidden" aria-hidden />
        <Minus className="hidden h-4 w-4 group-open:block" aria-hidden />
      </span>
    </summary>
    <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted">{answer}</p>
  </details>
)

export const VipFaq = ({ paymentLink, loading }: VipFaqProps) => {
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")
  const faqs = t("vipPage.faq.items", { returnObjects: true }) as FaqEntry[]

  return (
    <motion.section
      aria-labelledby="vip-faq-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <SectionHeading
        id="vip-faq-heading"
        title={t("vipPage.faq.title")}
        highlight={t("vipPage.faq.titleHighlight")}
        description={t("vipPage.faq.subtitle")}
      />

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((item, index) => (
          <FaqItem
            key={`${index}-${item.question.slice(0, 24)}`}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-md">
        <VipCtaButton label={ctaLabel} calendarUrl={paymentLink} loading={loading} />
      </div>
    </motion.section>
  )
}
