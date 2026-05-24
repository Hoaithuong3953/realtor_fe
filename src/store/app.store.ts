import { create } from "zustand"
import { persist } from "zustand/middleware"
import i18n from "i18next"

export type Theme = "dark" | "light" | "system"

interface AppState {
  theme: Theme
  setTheme: (theme: Theme) => void
  language: "vi" | "en"
  setLanguage: (lang: "vi" | "en") => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      language: "vi",
      setLanguage: (language) => {
        set({ language })
        void i18n.changeLanguage(language)
      },
      viewMode: "grid",
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    {
      name: "app-preferences",
    }
  )
)

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement
  root.classList.remove("light", "dark")

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    root.classList.add(systemTheme)
    return
  }

  root.classList.add(theme)
}

applyTheme(useAppStore.getState().theme)

useAppStore.subscribe((state) => applyTheme(state.theme))

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (useAppStore.getState().theme === "system") {
    applyTheme("system")
  }
})
