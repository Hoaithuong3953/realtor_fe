import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enAuth from "./locales/en/auth.json"
import enCommon from "./locales/en/common.json"
import viAuth from "./locales/vi/auth.json"
import viCommon from "./locales/vi/common.json"

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
  },
  en: {
    common: enCommon,
    auth: enAuth,
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    ns: ["common", "auth"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

export default i18n
