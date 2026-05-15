import * as React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { ResetPasswordForm } from "@/components/organisms/auth/reset-password-form"
import { useResetPasswordMutation } from "@/hooks/use-auth"
import { paths } from "@/routes/paths"
import type { ResetPasswordFormValues } from "@/schemas/auth.schema"

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTranslation("auth")
  const token = searchParams.get("token")

  const { mutate: resetPassword, isPending, isError } = useResetPasswordMutation()

  React.useEffect(() => {
    if (!token) {
      toast.error(t("reset_password.missing_token"))
      void navigate(paths.auth.login, { replace: true })
    }
  }, [token, navigate, t])

  const handleResetPasswordSubmit = (data: ResetPasswordFormValues) => {
    if (!token) return
    resetPassword({ token, new_password: data.password })
  }

  if (!token) return null

  return (
    <ResetPasswordForm
      onSubmit={handleResetPasswordSubmit}
      isPending={isPending}
      isError={isError}
    />
  )
}
