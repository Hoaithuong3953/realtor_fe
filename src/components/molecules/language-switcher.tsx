import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui"

/**
 * LanguageSwitcher allows users to toggle between supported languages (VI/EN)
 */
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng)
  }

  const currentLangLabel = i18n.language.startsWith("vi") ? "VI" : "EN"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3 border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentLangLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[120px]">
        <DropdownMenuItem
          onClick={() => changeLanguage("vi")}
          className={
            i18n.language.startsWith("vi")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={
            !i18n.language.startsWith("vi")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
