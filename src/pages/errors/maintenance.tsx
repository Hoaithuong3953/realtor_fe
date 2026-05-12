import { useTranslation } from "react-i18next"

import { Button } from "@/components/atoms"

export default function MaintenancePage() {
  const { t } = useTranslation("common")

  return (
    <div className="space-y-6 max-w-md animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2">
        <h1 className="text-8xl font-black text-primary">503</h1>
        <h2 className="text-2xl font-bold">{t("errors.maintenance.title")}</h2>
        <p className="text-muted-foreground">
          {t("errors.maintenance.description")}
        </p>
      </div>
      <Button onClick={() => window.location.reload()} size="lg">
        {t("errors.maintenance.retry")}
      </Button>
    </div>
  )
}
