import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, KeyRound, Lock, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { Button, Input } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { paths } from "@/routes/paths"
import { type ResetPasswordFormValues, resetPasswordSchema } from "@/schemas/auth.schema"

type ResetPasswordFormProps = {
  onSubmit: (data: ResetPasswordFormValues) => void
  isPending: boolean
  isError?: boolean
  className?: string
}

export const ResetPasswordForm = ({ onSubmit, isPending, isError, className }: ResetPasswordFormProps) => {
  const { t } = useTranslation("auth")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  if (isError) {
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

  return (
    <Card
      className={className}
      title={
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-sm">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">{t("reset_password.title")}</span>
        </div>
      }
      description={
        <span className="text-center block text-muted-foreground">
          {t("reset_password.description")}
        </span>
      }
      contentClassName="space-y-5 mt-4"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label={t("reset_password.password_label")}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={errors.password?.message ? t(errors.password.message) : undefined}
            {...register("password")}
          />
          
          <Input
            label={t("reset_password.confirm_password_label")}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined}
            {...register("confirmPassword")}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Button type="submit" fullWidth size="lg" isLoading={isPending} loadingText={t("reset_password.submitting_btn")}>
            {t("reset_password.submit_btn")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
