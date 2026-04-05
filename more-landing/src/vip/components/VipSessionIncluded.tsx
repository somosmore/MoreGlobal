import { Sparkles } from "lucide-react"
import { useTranslation } from "react-i18next"

type Pillar = {
  title: string
  description: string
}

export const VipSessionIncluded = () => {
  const { t } = useTranslation()
  const pillars = t("vipPage.included.pillars", { returnObjects: true }) as Pillar[]

  return (
    <section className="py-32 sm:py-32">
      <div className="relative overflow-hidden rounded-3xl border border-orange/25 bg-linear-to-br from-[#FFF8F4] via-white to-[#FFF3E6] shadow-xl">
        <div className="h-1.5 w-full bg-linear-to-r from-orange to-orange-dark" />

        <div className="px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-orange">
                <Sparkles className="h-3 w-3 text-orange" />
                {t("vipPage.included.eyebrow")}
              </p>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold leading-snug text-navy sm:text-3xl">
                {t("vipPage.included.title")}
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="group flex flex-col gap-2 rounded-2xl bg-white/90 p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-navy">{item.title}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
