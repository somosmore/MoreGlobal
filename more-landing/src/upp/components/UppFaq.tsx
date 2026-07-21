import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { UppCtaButtons } from "./UppCtaButtons"

type UppFaqProps = {
  paymentLink?: string | null
  whatsappUrl: string
  loading?: boolean
}

export function UppFaq({ paymentLink, whatsappUrl, loading }: UppFaqProps) {
  const { t } = useTranslation()
  const items = t("uppPage.faq.items", { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-10"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight text-navy-deep sm:text-4xl">
          {t("uppPage.faq.title")}
        </h2>
        <p className="mt-4 text-gray-500 text-lg">{t("uppPage.faq.subtitle")}</p>
      </motion.div>

      <div className="mx-auto max-w-2xl space-y-3">
        {items.map((item, i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06, type: "spring", stiffness: 120 }}
            className="group rounded-2xl border border-navy/15 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-navy-deep sm:text-base">
              {item.question}
              <span className="shrink-0 text-xl leading-none text-navy/40 transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-gray-500">
              {item.answer}
            </div>
          </motion.details>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 flex justify-center"
      >
        <UppCtaButtons
          paymentLink={paymentLink}
          whatsappUrl={whatsappUrl}
          loading={loading}
        />
      </motion.div>
    </div>
  )
}
