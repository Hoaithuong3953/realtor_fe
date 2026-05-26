import { useEffect } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"

import { Button, Input } from "@/components/atoms"
import { Select } from "@/components/molecules"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { userCreateSchema, userUpdateSchema } from "@/schemas/user.schema"
import type { UserFormData, UserUiModel } from "@/types/ui/user"

export interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: UserUiModel
  onSubmit: (data: UserFormData) => void
  isPending?: boolean
  statusOptions: { label: string; value: string }[]
  roleOptions: { label: string; value: string }[]
  isLoadingRoles?: boolean
}

export const UserFormModal = ({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isPending,
  statusOptions,
  roleOptions,
  isLoadingRoles
}: UserFormModalProps) => {
  const { t } = useTranslation(["common", "user"])
  const isEditing = !!initialData

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema) as unknown as Resolver<UserFormData>,
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role_id: null,
      status: "active",
      password: ""
    }
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          full_name: initialData.full_name,
          email: initialData.email,
          phone: initialData.phone || "",
          role_id: initialData.role_id,
          status: initialData.status,
          password: ""
        })
      } else {
        reset({
          full_name: "",
          email: "",
          phone: "",
          role_id: null,
          status: "active",
          password: ""
        })
      }
    }
  }, [open, initialData, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("user:form.title_edit") : t("user:form.title_add")}</DialogTitle>
        </DialogHeader>
      <div className="space-y-6 pt-4">
        <div className="grid grid-cols-1 gap-4">
          <Controller
            control={control}
            name="full_name"
            render={({ field }) => (
              <Input
                label={t("user:form.full_name")}
                required
                placeholder={t("user:form.full_name_placeholder")}
                error={errors.full_name?.message ? t(errors.full_name.message, { ns: "user" }) : undefined}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label={t("user:form.email")}
                required
                type="email"
                placeholder={t("user:form.email_placeholder")}
                disabled={isEditing}
                error={errors.email?.message ? t(errors.email.message, { ns: "user" }) : undefined}
                {...field}
              />
            )}
          />

          {!isEditing && (
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  label={t("user:form.password")}
                  required
                  type="password"
                  placeholder={t("user:form.password_placeholder")}
                  error={errors.password?.message ? t(errors.password.message, { ns: "user" }) : undefined}
                  {...field}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label={t("user:form.phone")}
                placeholder={t("user:form.phone_placeholder")}
                error={errors.phone?.message ? t(errors.phone.message, { ns: "user" }) : undefined}
                {...field}
                value={field.value || ""}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={control}
              name="role_id"
              render={({ field }) => (
                <Select
                  label={t("user:form.role")}
                  options={roleOptions}
                  value={field.value ? String(field.value) : ""}
                  onChange={(val) => field.onChange(val ? Number(val) : null)}
                  disabled={isLoadingRoles}
                  placeholder={isLoadingRoles ? t("user:form.role_loading") : t("user:form.role_placeholder")}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select
                  label={t("user:form.status")}
                  options={statusOptions}
                  value={field.value || "active"}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? t("common:actions.loading") : t("common:actions.save")}
          </Button>
        </DialogFooter>
      </div>
      </DialogContent>
    </Dialog>
  )
}
