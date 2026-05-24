import { Monitor, Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Dropdown } from "@/components/molecules/dropdown"
import { useAppStore } from "@/store/app.store"

const themes = [
  { value: "light", labelKey: "theme.light", icon: Sun },
  { value: "dark", labelKey: "theme.dark", icon: Moon },
  { value: "system", labelKey: "theme.system", icon: Monitor },
] as const

export const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore()
  const { t } = useTranslation("common")

  return (
    <Dropdown
      align="end"
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Toggle theme">
          <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
      }
      items={themes.map(({ value, labelKey, icon }) => ({
        id: value,
        icon,
        label: t(labelKey),
        onClick: () => setTheme(value),
        className: theme === value ? "bg-accent text-accent-foreground" : "",
      }))}
    />
  )
}
