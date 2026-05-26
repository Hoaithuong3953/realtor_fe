import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button, Input, Textarea } from "@/components/atoms"
import { Select, CurrencyInput } from "@/components/molecules"
import { type SelectOption } from "@/components/molecules/select"
import { clientSchema } from "@/schemas/client.schema"
import { type ClientFormData } from "@/types/ui/client"

interface ClientFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ClientFormData | null
  onSubmit: (data: ClientFormData) => void
  isPending?: boolean
  typeOptions: SelectOption[]
  goalOptions: SelectOption[]
  statusOptions: SelectOption[]
}

const defaultValues: ClientFormData = {
  full_name: "",
  phone: "",
  email: "",
  customer_type: "buyer",
  goal_type: "buy",
  budget_min: null,
  budget_max: null,
  status: "new",
  summary: "",
}

export const ClientFormModal = ({ 
  open, 
  onOpenChange, 
  initialData, 
  onSubmit, 
  isPending, 
  typeOptions, 
  goalOptions, 
  statusOptions 
}: ClientFormModalProps) => {
  const { t } = useTranslation(["client", "common"])
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || defaultValues
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          full_name: initialData.full_name,
          phone: initialData.phone || "",
          email: initialData.email || "",
          customer_type: initialData.customer_type || "buyer",
          goal_type: initialData.goal_type || "buy",
          budget_min: initialData.budget_min ?? null,
          budget_max: initialData.budget_max ?? null,
          status: initialData.status || "new",
          summary: initialData.summary || "",
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [initialData, open, reset])

  const handleFormSubmit = (data: ClientFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("form.title_edit") : t("form.title_add")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              id="full_name"
              label={t("form.full_name")}
              placeholder={t("form.full_name_placeholder")}
              error={errors.full_name?.message}
              required
              containerClassName="col-span-2"
              {...register("full_name")}
            />
            
            <Input 
              id="phone"
              label={t("form.phone")}
              placeholder={t("form.phone_placeholder")}
              error={errors.phone?.message}
              {...register("phone")}
            />

            <Input 
              id="email"
              type="email"
              label={t("form.email")}
              placeholder={t("form.email_placeholder")}
              error={errors.email?.message}
              {...register("email")}
            />

            <Controller
              control={control}
              name="customer_type"
              render={({ field }) => (
                <Select 
                  label={t("form.customer_type")}
                  value={field.value} 
                  onChange={v => {
                    const type = v as ClientFormData["customer_type"];
                    let goal: ClientFormData["goal_type"] = "buy";
                    if (type === "buyer") goal = "buy";
                    else if (type === "seller") goal = "sell";
                    else if (type === "renter") goal = "rent";
                    else if (type === "landlord") goal = "lease";
                    
                    field.onChange(type);
                    setValue("goal_type", goal);
                  }}
                  options={typeOptions}
                />
              )}
            />

            <Controller
              control={control}
              name="goal_type"
              render={({ field }) => (
                <Select 
                  label={t("form.goal_type")}
                  value={field.value} 
                  disabled={true}
                  onChange={field.onChange}
                  options={goalOptions}
                />
              )}
            />

            <Controller
              control={control}
              name="budget_min"
              render={({ field }) => (
                <CurrencyInput 
                  id="budget_min"
                  label={t("form.budget_min")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.budget_min?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="budget_max"
              render={({ field }) => (
                <CurrencyInput 
                  id="budget_max"
                  label={t("form.budget_max")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.budget_max?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select 
                  label={t("form.status")}
                  value={field.value} 
                  onChange={field.onChange}
                  options={statusOptions}
                  containerClassName="col-span-2"
                />
              )}
            />

            <Textarea 
              id="summary"
              label={t("form.summary")}
              rows={3}
              placeholder={t("form.summary_placeholder")}
              containerClassName="col-span-2"
              error={errors.summary?.message}
              {...register("summary")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:actions.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common:actions.loading") : t("common:actions.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
