import * as React from "react"

import { ForgotPasswordForm } from "@/components/organisms/auth/forgot-password-form"
import { ForgotPasswordSuccessView } from "@/components/organisms/auth/forgot-password-success-view"
import { useForgotPasswordMutation } from "@/hooks/use-auth"
import { useCountdown } from "@/hooks/use-countdown"
import type { ForgotPasswordFormValues } from "@/schemas/auth.schema"

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(null)
  const { count, startCountdown } = useCountdown(60)

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation()

  const handleForgotPasswordSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email)
        startCountdown()
      },
    })
  }

  const handleResend = () => {
    if (submittedEmail) {
      forgotPassword(
        { email: submittedEmail },
        {
          onSuccess: () => {
            startCountdown()
          },
        }
      )
    }
  }

  if (submittedEmail) {
    return (
      <ForgotPasswordSuccessView
        email={submittedEmail}
        onResend={handleResend}
        resendCountdown={count}
        isResending={isPending}
      />
    )
  }

  return (
    <ForgotPasswordForm
      onSubmit={handleForgotPasswordSubmit}
      isPending={isPending}
    />
  )
}
