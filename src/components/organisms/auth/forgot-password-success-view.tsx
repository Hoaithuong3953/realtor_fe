import { ArrowLeft, MailCheck } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { paths } from "@/routes/paths"

type ForgotPasswordSuccessViewProps = {
  email: string
  onResend: () => void
  resendCountdown: number
  isResending: boolean
  className?: string
}

export const ForgotPasswordSuccessView = ({
  email,
  onResend,
  resendCountdown,
  isResending,
  className,
}: ForgotPasswordSuccessViewProps) => {
  const { t } = useTranslation("auth")

  return (
    <Card
      className={className}
      title={
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="p-4 bg-green-500/10 rounded-full shadow-sm">
            <MailCheck className="w-10 h-10 text-green-500" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-center">{t("forgot_password.success_title")}</span>
        </div>
      }
      description={
        <span className="text-center block text-muted-foreground mt-2 px-2 leading-relaxed">
          {t("forgot_password.success_desc", { email })}
        </span>
      }
      contentClassName="space-y-5 mt-6"
    >
      <div className="space-y-3">
        <Button
          variant="solid"
          fullWidth
          size="lg"
          isLoading={isResending}
          disabled={resendCountdown > 0}
          onClick={onResend}
        >
          {resendCountdown > 0 
            ? t("forgot_password.resend_btn_countdown", { count: resendCountdown })
            : t("forgot_password.resend_btn")}
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
