import { useForgotPasswordMutation } from "@/hooks/use-auth"
import { ForgotPasswordForm } from "@/components/organisms/auth/forgot-password-form"
import type { ForgotPasswordFormValues } from "@/schemas/auth.schema"

export default function ForgotPasswordPage() {
  const {mutate: forgotPassword, isPending} = useForgotPasswordMutation()

  const handleForgotPasswordSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data)
  }

  return (
    <ForgotPasswordForm
      onSubmit={handleForgotPasswordSubmit}
      isPending={isPending}
    />
  )
}
