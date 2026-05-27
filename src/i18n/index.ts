import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enAuth from "./locales/en/auth.json"
import enCommon from "./locales/en/common.json"
import enDashboard from "./locales/en/dashboard.json"
import enListing from "./locales/en/listing.json"
import enClient from "./locales/en/client.json"
import enUser from "./locales/en/user.json"
import enRole from "./locales/en/role.json"
import viAuth from "./locales/vi/auth.json"
import viCommon from "./locales/vi/common.json"
import viDashboard from "./locales/vi/dashboard.json"
import viListing from "./locales/vi/listing.json"
import viClient from "./locales/vi/client.json"
import viUser from "./locales/vi/user.json"
import viRole from "./locales/vi/role.json"
import viChat from "./locales/vi/chat.json"
import enChat from "./locales/en/chat.json"

const resources = {
  vi: {
    common: viCommon,
    auth: viAuth,
    dashboard: viDashboard,
    listing: viListing,
    client: viClient,
    user: viUser,
    role: viRole,
    chat: viChat,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    listing: enListing,
    client: enClient,
    user: enUser,
    role: enRole,
    chat: enChat,
  },
} as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    ns: ["common", "auth", "dashboard", "listing", "client", "user", "role", "chat"],
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
