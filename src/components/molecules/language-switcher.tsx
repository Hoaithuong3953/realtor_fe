import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"
import { Dropdown } from "@/components/molecules/dropdown"
import { Button } from "@/components/ui"
import { useAppStore } from "@/store/app.store"

/**
 * LanguageSwitcher allows users to toggle between supported languages (VI/EN)
 */
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const setLanguage = useAppStore((state) => state.setLanguage)

  const changeLanguage = (lng: "vi" | "en") => {
    setLanguage(lng)
  }

  const currentLangLabel = i18n.language.startsWith("vi") ? "VI" : "EN"

  return (
    <Dropdown
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentLangLabel}</span>
        </Button>
      }
      align="end"
      className="w-[120px]"
      items={[
        {
          id: "vi",
          label: "Tiếng Việt",
          onClick: () => changeLanguage("vi"),
          className: i18n.language.startsWith("vi") ? "bg-accent text-accent-foreground" : "",
        },
        {
          id: "en",
          label: "English",
          onClick: () => changeLanguage("en"),
          className: !i18n.language.startsWith("vi") ? "bg-accent text-accent-foreground" : "",
        },
      ]}
    />
  )
}
