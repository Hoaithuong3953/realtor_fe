import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enAuth from "./locales/en/auth.json"
import enCommon from "./locales/en/common.json"
import enDashboard from "./locales/en/dashboard.json"
import viAuth from "./locales/vi/auth.json"
import viCommon from "./locales/vi/common.json"
import viDashboard from "./locales/vi/dashboard.json"

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    dashboard: viDashboard,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    ns: ["common", "auth", "dashboard"],
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
