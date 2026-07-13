import { motion } from "framer-motion"
import {
  CalendarCheck,
  ClipboardList,
  Globe,
  Lightbulb,
  MessageCircle,
  Signpost,
  ShieldCheck,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { VipCtaButton } from "./VipCtaButton"
import { SectionHeading } from "@/components/brand/SectionHeading"
import { VipSpecsBar } from "./VipSpecsBar"

const DELIVERABLE_ICONS = [
  ClipboardList,
  Signpost,
  Lightbulb,
  ShieldCheck,
  Globe,
  MessageCircle,
] as const

type VipReceiveSectionProps = {
  paymentLink: string
  price: string
  loading?: boolean
}

export const VipReceiveSection = ({ paymentLink, price, loading }: VipReceiveSectionProps) => {
  const { t } = useTranslation()
  const deliverables = t("vipPage.receive.items", { returnObjects: true }) as string[]
  const ctaLabel = t("vipPage.cta.applyNow")

  return (
    <motion.section
      aria-labelledby="vip-receive-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <SectionHeading
        id="vip-receive-heading"
        title={t("vipPage.receive.title")}
        highlight={t("vipPage.receive.titleHighlight")}
        kicker={t("vipPage.receive.kicker")}
        description={t("vipPage.receive.description")}
      />

      <div className="mt-12 rounded-3xl border border-navy/15 bg-white/80 p-6 shadow-[0_24px_60px_-30px_rgba(27,43,68,0.3)] backdrop-blur-sm sm:p-9">
        <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((item, index) => {
            const Icon = DELIVERABLE_ICONS[index] ?? ClipboardList
            // Alterna navy/naranja como los círculos de la presentación
            const filled = index % 2 === 1
            return (
              <li key={item} className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white ${
                    filled ? "bg-orange" : "bg-navy-deep"
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <p className="font-sans text-sm leading-relaxed text-navy sm:text-[15px]">{item}</p>
              </li>
            )
          })}
        </ul>
      </div>

      <VipSpecsBar price={price} className="mt-6" />

      <div className="mt-6 flex flex-col items-center gap-5 rounded-3xl border border-orange/40 bg-paper-warm/70 p-6 sm:flex-row sm:p-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-white">
          <CalendarCheck className="h-7 w-7" aria-hidden />
        </span>

        <p className="flex-1 text-balance text-center font-display text-xl leading-snug text-navy sm:text-left sm:text-2xl">
          {t("vipPage.receive.ctaLead")}
          <span className="text-orange">{t("vipPage.receive.ctaLeadHighlight")}</span>
          {t("vipPage.receive.ctaLeadRest")}
        </p>

        <div className="w-full sm:w-auto sm:min-w-[220px]">
          <VipCtaButton label={ctaLabel} calendarUrl={paymentLink} loading={loading} />
        </div>
      </div>
    </motion.section>
  )
}
