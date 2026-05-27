import { ProfileForm } from "@/components/organisms/settings/profile-form"
import { useCurrentUserQuery } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth.store"
import { useUpdateProfileMutation } from "@/hooks/use-users"
import { useTranslation } from "react-i18next"

export default function ProfilePage() {
  const { t } = useTranslation("user")
  const storeUser = useAuthStore(state => state.user)
  const { data: currentUser, isLoading } = useCurrentUserQuery()
  const { mutate: updateProfile, isPending } = useUpdateProfileMutation()

  const initialData = {
    full_name: currentUser?.full_name || storeUser?.full_name || "",
    email: currentUser?.email || storeUser?.email || "",
  }

  return (
    <div className="flex-1 space-y-6 w-full p-6 pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("profile.title")}</h1>
        <p className="text-muted-foreground">
          {t("profile.description")}
        </p>
      </div>

      <div className="w-full">
        <ProfileForm
          initialData={initialData}
          isLoading={isLoading && !storeUser}
          isPending={isPending}
          onSubmit={(data, onSuccess) => {
            updateProfile(data, { onSuccess })
          }}
        />
      </div>
    </div>
  )
}
