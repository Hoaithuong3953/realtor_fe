import { useLoginMutation } from "@/hooks/use-auth"
import { LoginForm } from "@/components/organisms/auth/login-form"
import type { LoginFormValues } from "@/schemas/auth.schema"

export default function LoginPage() {
  const {mutate: login, isPending} = useLoginMutation()

  const handleLoginSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <LoginForm 
      onSubmit={handleLoginSubmit}
      isPending={isPending}
    />
  )
}
