import { zodResolver } from "@hookform/resolvers/zod"
import { Building2, Lock,Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Button, Input } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { paths } from "@/routes/paths"
import { type LoginFormValues,loginSchema } from "@/schemas/auth.schema"

type LoginFormProps = {
  onSubmit: (data: LoginFormValues) => void
  isPending: boolean
  className?: string
}

export const LoginForm = ({onSubmit, isPending,className}: LoginFormProps) => {
  const {t} = useTranslation("auth")

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email: "", password: ""}
  });

  return (
    <Card
      className={className}
      title={
        <div className="flex flex-col items-center justify-center space-y-3 mb-2">
          <div className="p-3 bg-primary/10 rounded-2xl shadow-sm">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight">{t("login.title")}</span>
        </div>
      }
      description={
        <span className="text-center block text-muted-foreground">
          {t("login.description")}
        </span>
      }
      contentClassName="space-y-5 mt-4"
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <Input
            label={t("login.email_label")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            prefix={<Mail size={16} />}
            disabled={isPending}
            error={
              errors.email?.message
                ? t(errors.email.message)
                : undefined
            }
            {...register("email")}
          />

          <Input
            label={t("login.password_label")}
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={
              errors.password?.message
                ? t(errors.password.message)
                : undefined
            }
            {...register("password")}
          />
        </div>

        <div className="flex justify-end">
          <a
            href={paths.auth.forgotPassword}
            className="text-sm font-medium text-link hover:text-link-hover whitespace-nowrap"
          >
            {t("login.forgot_password")}
          </a>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isPending} loadingText={t("login.submitting_btn")}>
          {t("login.submit_btn")}
        </Button>
      </form>
    </Card>
  );
}