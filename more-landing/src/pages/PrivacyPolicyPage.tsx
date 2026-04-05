import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Navbar from "@/components/sections/Navbar"
import Footer from "@/components/sections/Footer"

const PRIVACY_CONTACT_EMAIL = "soporte@justmore.net"

const asStringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []

const mailtoPrivacyHref = `mailto:${PRIVACY_CONTACT_EMAIL}`

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = t("privacyPolicy.pageTitle")
    return () => {
      document.title = t("blueprint.defaultTitle")
    }
  }, [t])

  const s2Items = asStringList(t("privacyPolicy.s2Items", { returnObjects: true }))
  const s3Items = asStringList(t("privacyPolicy.s3Items", { returnObjects: true }))
  const s5Items = asStringList(t("privacyPolicy.s5Items", { returnObjects: true }))

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8" id="main-content">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-[#2A3A4A] sm:text-3xl">
            {t("privacyPolicy.title")}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{t("privacyPolicy.lastUpdated")}</p>
          <p className="mt-8 text-base leading-relaxed text-gray-600">{t("privacyPolicy.intro")}</p>

          <aside
            className="mt-8 rounded-lg border border-gray-200 border-l-4 border-l-[#F37021] bg-gray-50/80 p-5 sm:p-6"
            aria-labelledby="privacy-educational-notice"
          >
            <h2
              id="privacy-educational-notice"
              className="text-base font-semibold text-[#2A3A4A]"
            >
              {t("privacyPolicy.educationalNoticeTitle")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-700">
              {t("privacyPolicy.educationalNoticeBody")}
            </p>
          </aside>

          <section className="mt-10" aria-labelledby="privacy-s1">
            <h2 id="privacy-s1" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s1Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s1p1")}</p>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s1Address")}</p>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              {t("privacyPolicy.s1ContactLead")}{" "}
              <a
                href={mailtoPrivacyHref}
                className="font-medium text-[#F37021] underline decoration-[#F37021]/30 underline-offset-2 transition-colors hover:text-[#d85f1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                aria-label={t("privacyPolicy.emailContactAria", { email: PRIVACY_CONTACT_EMAIL })}
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s2">
            <h2 id="privacy-s2" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s2Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s2Intro")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600 marker:text-[#F37021]">
              {s2Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s3">
            <h2 id="privacy-s3" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s3Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s3Intro")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600 marker:text-[#F37021]">
              {s3Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s4">
            <h2 id="privacy-s4" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s4Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s4Body")}</p>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s5">
            <h2 id="privacy-s5" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s5Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s5Intro")}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-600 marker:text-[#F37021]">
              {s5Items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s6">
            <h2 id="privacy-s6" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s6Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s6P1")}</p>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              {t("privacyPolicy.s6BeforeEmail")}{" "}
              <a
                href={mailtoPrivacyHref}
                className="font-medium text-[#F37021] underline decoration-[#F37021]/30 underline-offset-2 transition-colors hover:text-[#d85f1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                aria-label={t("privacyPolicy.emailContactAria", { email: PRIVACY_CONTACT_EMAIL })}
              >
                {PRIVACY_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section className="mt-10" aria-labelledby="privacy-s7">
            <h2 id="privacy-s7" className="text-lg font-semibold text-[#2A3A4A]">
              {t("privacyPolicy.s7Title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">{t("privacyPolicy.s7Body")}</p>
          </section>
        </article>
      </main>
      <Footer hideLandingFaq />
    </div>
  )
}
