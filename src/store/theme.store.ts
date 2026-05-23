import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "dark" | "light" | "system"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "vite-ui-theme",
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

// Khởi tạo Theme ngay khi load file (không cần chờ React mount)
applyTheme(useThemeStore.getState().theme)

// Tự động apply vào DOM mỗi khi Store bị thay đổi
useThemeStore.subscribe((state) => applyTheme(state.theme))

// Lắng nghe sự thay đổi giao diện từ Hệ điều hành (Windows/Mac)
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (useThemeStore.getState().theme === "system") {
    applyTheme("system")
  }
})
