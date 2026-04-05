import { motion } from "framer-motion"
import { Check, MessageCircle, Scale, Target } from "lucide-react"
import { useTranslation } from "react-i18next"

type SessionFocusItem = {
  title: string
  text: string
}

const SESSION_ICONS = [MessageCircle, Scale, Target] as const

export const VipAboutIvon = () => {
  const { t } = useTranslation()
  const sessionFocus = t("vipPage.aboutIvon.sessionFocus", { returnObjects: true }) as SessionFocusItem[]
  const credibility = t("vipPage.aboutIvon.credibility", { returnObjects: true }) as string[]

  return (
    <motion.section
      className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_20px_50px_-20px_rgba(42,58,74,0.15)] ring-1 ring-black/4"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      aria-labelledby="vip-about-ivon-heading"
    >
      <div className="h-1 w-full bg-linear-to-r from-orange via-orange-dark to-navy/40" aria-hidden />

      <div className="grid lg:grid-cols-12 lg:items-stretch">
        <div className="relative aspect-4/5 min-h-[300px] w-full lg:col-span-5 lg:aspect-auto lg:min-h-[min(100%,620px)]">
          <img
            src="/ivon.png"
            alt={t("vipPage.aboutIvon.imageAlt")}
            className="absolute inset-0 h-full w-full object-cover object-[center_top]"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/25 to-transparent lg:via-navy/15"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
            <p
              className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-orange-200/95"
              data-vip-eyebrow="true"
            >
              {t("vipPage.aboutIvon.overlayEyebrow")}
            </p>
            <p className="mt-2 font-sans text-2xl font-bold tracking-tight sm:text-3xl">
              {t("vipPage.aboutIvon.overlayName")}
            </p>
            <figure className="mt-5 hidden border-l-[3px] border-orange pl-4 sm:block">
              <blockquote className="text-sm font-normal leading-relaxed text-white/95">
                {t("vipPage.aboutIvon.quote")}
              </blockquote>
            </figure>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-8 p-6 sm:p-9 lg:col-span-7 lg:gap-10 lg:p-12 lg:pl-10 xl:pl-14">
          <header className="space-y-4">
            <p
              className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-orange"
              data-vip-eyebrow="true"
            >
              {t("vipPage.aboutIvon.headerEyebrow")}
            </p>
            <h2
              id="vip-about-ivon-heading"
              className="text-balance text-2xl font-semibold leading-snug text-navy sm:text-3xl lg:text-[1.75rem] lg:leading-tight xl:text-4xl"
            >
              {t("vipPage.aboutIvon.heading")}
            </h2>
            <p className="max-w-xl font-sans text-[15px] leading-relaxed text-gray-600 sm:text-base">
              {t("vipPage.aboutIvon.intro")}
            </p>
          </header>

          <div>
            <p
              className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-navy/55"
              data-vip-eyebrow="true"
            >
              {t("vipPage.aboutIvon.sessionTopicsEyebrow")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {sessionFocus.map((item, index) => {
                const Icon = SESSION_ICONS[index] ?? MessageCircle
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-navy/8 bg-linear-to-b from-navy/4 to-white px-4 py-4 ring-1 ring-black/3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/12 text-orange">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mt-3 font-sans text-sm font-semibold text-navy">{item.title}</p>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-gray-600">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <ul className="grid gap-3 font-sans text-sm text-gray-800 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3 sm:text-[15px]">
            {credibility.map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange text-white"
                  aria-hidden
                >
                  <Check className="h-4 w-4 stroke-3" />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <aside className="rounded-2xl border border-navy/10 bg-navy/3 p-5 sm:p-6">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-navy/60">
              {t("vipPage.aboutIvon.howWeWorkTitle")}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-gray-700 sm:text-[15px]">
              {t("vipPage.aboutIvon.howWeWorkBody")}
            </p>
          </aside>

          <figure className="rounded-2xl border border-orange/20 bg-orange/6 p-5 sm:hidden">
            <blockquote className="text-center font-sans text-sm italic leading-relaxed text-navy">
              {t("vipPage.aboutIvon.quote")}
            </blockquote>
            <figcaption className="mt-3 text-center font-sans text-xs font-semibold text-orange-dark">
              {t("vipPage.aboutIvon.quoteAttribution")}
            </figcaption>
          </figure>
        </div>
      </div>
    </motion.section>
  )
}
