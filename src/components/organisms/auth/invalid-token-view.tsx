import { ArrowLeft, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { paths } from "@/routes/paths"

type InvalidTokenViewProps = {
  className?: string
}

export const InvalidTokenView = ({ className }: InvalidTokenViewProps) => {
  const { t } = useTranslation("auth")

  return (
    <Card
      className={className}
      title={
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="p-4 bg-destructive/10 rounded-full shadow-sm">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-center">{t("reset_password.expired_title")}</span>
        </div>
      }
      description={
        <span className="text-center block text-muted-foreground mt-2 px-2 leading-relaxed">
          {t("reset_password.expired_desc")}
        </span>
      }
    >
      <div className="mt-6 space-y-3">
        <Button fullWidth size="lg" asChild>
          <Link to={paths.auth.forgotPassword}>
            {t("reset_password.request_new_link")}
          </Link>
        </Button>
        <Button variant="outline" fullWidth className="text-muted-foreground hover:text-foreground" asChild>
          <Link to={paths.auth.login} className="flex items-center justify-center w-full gap-2">
            <ArrowLeft size={16} />
            {t("forgot_password.back_to_login")}
          </Link>
        </Button>
      </div>
    </Card>
  )
}
