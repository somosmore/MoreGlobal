import { useTranslation } from "react-i18next"
import { SectionHeading } from "@/components/brand/SectionHeading"

type SessionStep = {
  label: string
  body: string
}

export const ThankYouSession = () => {
  const { t } = useTranslation()
  const rawSteps = t("thankYouPage.session.steps", { returnObjects: true })
  const steps = Array.isArray(rawSteps) ? (rawSteps as SessionStep[]) : []

  if (steps.length === 0) return null

  return (
    <div>
      <SectionHeading
        title={t("thankYouPage.session.title")}
        highlight={t("thankYouPage.session.titleHighlight")}
        kicker={t("thankYouPage.session.kicker")}
      />

      <p className="mt-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.18em] text-orange">
        {t("thankYouPage.session.eyebrow")}
      </p>

      <ol className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.label} className="relative text-center sm:text-left">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy font-sans text-sm font-bold text-white">
              {index + 1}
            </span>
            <h3 className="mt-4 font-display text-xl text-navy-deep">{step.label}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted sm:text-[15px]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
