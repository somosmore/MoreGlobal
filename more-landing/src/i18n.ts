import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import es from "./locales/es/translation.json"
import esVipPage from "./locales/es/vipPage.json"
import esUppPage from "./locales/es/uppPage.json"
import esTurboPage from "./locales/es/turboPage.json"
import esThankYouPage from "./locales/es/thankYouPage.json"
import en from "./locales/en/translation.json"
import enVipPage from "./locales/en/vipPage.json"
import enUppPage from "./locales/en/uppPage.json"
import enTurboPage from "./locales/en/turboPage.json"
import enThankYouPage from "./locales/en/thankYouPage.json"

const esMerged = { ...es, ...esVipPage, ...esUppPage, ...esTurboPage, ...esThankYouPage }
const enMerged = { ...en, ...enVipPage, ...enUppPage, ...enTurboPage, ...enThankYouPage }

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: esMerged },
      en: { translation: enMerged },
    },
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "more_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
