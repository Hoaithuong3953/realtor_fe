import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Lock, Save } from "lucide-react"

import { Button, Input } from "@/components/atoms"
import { Card } from "@/components/molecules"
import { type ChangePasswordFormValues, changePasswordSchema } from "@/schemas/auth.schema"

export interface PasswordFormProps {
  isPending: boolean
  onSubmit: (data: ChangePasswordFormValues, onSuccess: () => void) => void
}

export const PasswordForm = ({ isPending, onSubmit }: PasswordFormProps) => {
  const { t } = useTranslation("auth")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_new_password: "" }
  })

  const handleFormSubmit = (data: ChangePasswordFormValues) => {
    onSubmit(data, () => reset())
  }

  return (
    <Card>
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="space-y-4 max-w-lg">
          <Input
            label={t("change_password.current_password_label")}
            type="password"
            placeholder="••••••••"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={errors.current_password?.message ? t(errors.current_password.message) : undefined}
            {...register("current_password")}
          />
          
          <Input
            label={t("change_password.new_password_label")}
            type="password"
            placeholder="••••••••"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={errors.new_password?.message ? t(errors.new_password.message) : undefined}
            {...register("new_password")}
          />

          <Input
            label={t("change_password.confirm_new_password_label")}
            type="password"
            placeholder="••••••••"
            prefix={<Lock size={16} />}
            disabled={isPending}
            error={errors.confirm_new_password?.message ? t(errors.confirm_new_password.message) : undefined}
            {...register("confirm_new_password")}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={isPending} isLoading={isPending} loadingText={t("change_password.submitting_btn")}>
            <Save className="w-4 h-4 mr-2" />
            {t("change_password.submit_btn")}
          </Button>
        </div>
      </form>
    </Card>
  )
}
