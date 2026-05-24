import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/atoms"
import { paths } from "@/routes/paths"

export default function ForbiddenPage() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  
  return (
    <div className="space-y-6 max-w-md animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2">
        <h1 className="text-8xl font-black text-primary">403</h1>
        <h2 className="text-2xl font-bold">{t("errors.forbidden.title")}</h2>
        <p className="text-muted-foreground">
          {t("errors.forbidden.description")}
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => { void navigate(-1); }}>
          {t("actions.go_back")}
        </Button>
        <Button onClick={() => { void navigate(paths.home); }}>
          {t("actions.go_home")}
        </Button>
      </div>
    </div>
  )
}
