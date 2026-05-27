import { PasswordForm } from "@/components/organisms/settings/password-form"
import { useChangePasswordMutation } from "@/hooks/use-auth"
import { useTranslation } from "react-i18next"

export default function ChangePasswordPage() {
  const { t } = useTranslation("auth")
  const { mutate: changePassword, isPending } = useChangePasswordMutation()

  return (
    <div className="flex-1 space-y-6 w-full p-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("change_password.title")}</h1>
        <p className="text-muted-foreground">
          {t("change_password.description")}
        </p>
      </div>

      <div className="w-full">
        <PasswordForm 
          isPending={isPending}
          onSubmit={(data, onSuccess) => {
            changePassword(data, { onSuccess })
          }}
        />
      </div>
    </div>
  )
}
