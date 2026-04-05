import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"

const DEFAULT_PAYMENT_LINK = "https://link.fastpaydirect.com/payment-link/69cea9584e543f5c4f105c5f"

type FaqEntry = {
  question: string
  answer: string
}

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
  const { t } = useTranslation()
  const ctaLabel = t("vipPage.cta.applyNow")
  const effectivePaymentLink = vipPaymentLink || calendarUrl || DEFAULT_PAYMENT_LINK
  const faqs = t("vipPage.faq.items", { returnObjects: true }) as FaqEntry[]

  return (
    <motion.section
      className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">
        {t("vipPage.faq.title")}
      </h2>
      <p className="mt-2 text-sm text-gray-600">{t("vipPage.faq.subtitle")}</p>
      <div className="mt-4 divide-y divide-gray-200">
        {faqs.map((item, index) => (
          <FaqItem
            key={`${index}-${item.question.slice(0, 24)}`}
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
