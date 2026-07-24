import { useTranslation } from "react-i18next"

export const ThankYouProof = () => {
  const { t } = useTranslation()

  return (
    <figure className="mx-auto max-w-2xl text-center">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-orange">
        {t("thankYouPage.proof.eyebrow")}
      </p>
      <blockquote className="mt-4 font-display text-xl leading-snug text-navy-deep sm:text-2xl">
        &ldquo;{t("thankYouPage.proof.quote")}&rdquo;
      </blockquote>
      <figcaption className="mt-5 space-y-1 font-sans text-sm text-ink-muted">
        <p className="font-semibold text-navy">{t("thankYouPage.proof.role")}</p>
        <p className="text-orange-dark">{t("thankYouPage.proof.result")}</p>
      </figcaption>
    </figure>
  )
}
