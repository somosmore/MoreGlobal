import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { TurboCtaButtons } from "./TurboCtaButtons"

type TurboFaqProps = {
  paymentLink?: string | null
  whatsappUrl: string
  loading?: boolean
}

export function TurboFaq({ paymentLink, whatsappUrl, loading }: TurboFaqProps) {
  const { t } = useTranslation()
  const items = t("turboPage.faq.items", { returnObjects: true }) as Array<{
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
        <h2 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">
          {t("turboPage.faq.title")}
        </h2>
        <p className="mt-4 text-gray-500 text-lg">{t("turboPage.faq.subtitle")}</p>
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
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-navy sm:text-base">
              {item.question}
              <span className="shrink-0 text-navy/40 transition-transform duration-200 group-open:rotate-45 text-xl leading-none">
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
        className="mx-auto mt-12 max-w-xl text-center"
      >
        <p className="text-base font-semibold text-navy mb-2">
          ¿Listo para comenzar tu proceso?
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Un asesor evaluará tu perfil y te explicará el proceso sin compromiso.
        </p>
        <TurboCtaButtons
          paymentLink={paymentLink}
          whatsappUrl={whatsappUrl}
          loading={loading}
          layout="row"
          showGuarantee
          theme="light"
        />
      </motion.div>
    </div>
  )
}
