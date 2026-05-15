import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, KeyRound, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button, Input } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { paths } from "@/routes/paths"
import { type ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/auth.schema"

type ForgotPasswordFormProps = {
  onSubmit: (data: ForgotPasswordFormValues) => void
  isPending: boolean
  className?: string
}

export const ForgotPasswordForm = ({ onSubmit, isPending, className }: ForgotPasswordFormProps) => {
  const { t } = useTranslation("auth")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  return (
    <Card
      className={className}
      title={
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-sm">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">{t("forgot_password.title")}</span>
        </div>
      }
      description={
        <span className="text-center block text-muted-foreground">
          {t("forgot_password.description")}
        </span>
      }
      contentClassName="space-y-5 mt-4"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label={t("forgot_password.email_label")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            prefix={<Mail size={16} />}
            disabled={isPending}
            error={errors.email?.message ? t(errors.email.message) : undefined}
            {...register("email")}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={isPending} loadingText={t("forgot_password.submitting_btn")}>
            {t("forgot_password.submit_btn")}
          </Button>

          <Button variant="outline" fullWidth className="text-muted-foreground hover:text-foreground" asChild>
            <Link to={paths.auth.login} className="flex items-center justify-center w-full gap-2">
              <ArrowLeft size={16} />
              {t("forgot_password.back_to_login")}
            </Link>
          </Button>
        </div>
      </form>
    </Card>
  )
}
