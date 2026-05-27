import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Save, User, Mail } from "lucide-react"

import { Button, Input } from "@/components/atoms"
import { Card, LoadingScreen } from "@/components/molecules"
import { type ProfileUpdateValues, profileUpdateSchema } from "@/schemas/user.schema"
import { useEffect, useState } from "react"
import { Pencil, X } from "lucide-react"

export interface ProfileFormProps {
  initialData: {
    full_name: string
    email: string
  }
  isLoading: boolean
  isPending: boolean
  onSubmit: (data: ProfileUpdateValues, onSuccess: () => void) => void
}

export const ProfileForm = ({
  initialData,
  isLoading,
  isPending,
  onSubmit
}: ProfileFormProps) => {
  const { t } = useTranslation(["user", "auth", "common"])
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: { full_name: "" }
  })

  useEffect(() => {
    reset({ full_name: initialData.full_name })
  }, [initialData, reset])

  const handleFormSubmit = (data: ProfileUpdateValues) => {
    onSubmit(data, () => setIsEditing(false))
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Card>
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="space-y-4 max-w-lg">
          <Input
            label={t("user:profile.full_name_label")}
            type="text"
            placeholder={t("user:profile.full_name_placeholder")}
            prefix={<User size={16} />}
            disabled={!isEditing || isPending}
            error={errors.full_name?.message ? t(`user:${errors.full_name.message}`) : undefined}
            {...register("full_name")}
          />
          
          <Input
            label={t("user:profile.email_label")}
            type="email"
            value={initialData.email}
            disabled={true}
            prefix={<Mail size={16} />}
            description={t("user:profile.email_read_only")}
          />

        </div>

        <div className="pt-4 flex gap-3">
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              <Pencil className="w-4 h-4 mr-2" />
              {t("common:actions.edit")}
            </Button>
          ) : (
            <>
              <Button type="submit" disabled={!isDirty || isPending} isLoading={isPending} loadingText={t("user:profile.submitting_btn")}>
                <Save className="w-4 h-4 mr-2" />
                {t("user:profile.submit_btn")}
              </Button>
              <Button type="button" variant="outline" disabled={isPending} onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                {t("common:actions.cancel")}
              </Button>
            </>
          )}
        </div>
      </form>
    </Card>
  )
}
