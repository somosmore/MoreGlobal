import { useTranslation } from "react-i18next"

export const VipFitSection = () => {
  const { t } = useTranslation()
  const items = t("vipPage.fit.items", { returnObjects: true }) as string[]

  return (
    <section className="rounded-3xl bg-white p-6 text-navy shadow-sm ring-1 ring-gray-100 sm:p-8">
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-orange/90">
          {t("vipPage.fit.title")}
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {items.map((item) => (
            <li key={item}>✓ {item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
