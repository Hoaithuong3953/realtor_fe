import { useFormContext, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input, Textarea } from "@/components/atoms"
import { Select, CurrencyInput } from "@/components/molecules"
import { type ListingFormValues } from "@/schemas/listing.schema"

interface BasicInfoStepProps {
  listingTypes: readonly string[]
  propertyTypes: readonly string[]
}

export const BasicInfoStep = ({ listingTypes, propertyTypes }: BasicInfoStepProps) => {
  const { t } = useTranslation(["listing", "common"])
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<ListingFormValues>()
  const listingType = watch("listing_type")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Input 
          {...register("title")} 
          label={t("form.title_label")}
          required 
          placeholder={t("form.title_placeholder")}
          error={errors.title?.message ? t(errors.title.message) : undefined}
        />
      </div>

      <Select
        label={t("form.listing_type_label")}
        required
        options={listingTypes.map(type => ({ value: type, label: t(`constants.listing_type_${type}`) }))}
        value={listingType}
        onChange={(val) => {
          setValue("listing_type", val as ListingFormValues["listing_type"], { shouldValidate: true })
          setValue("attributes.rent_period", undefined)
          setValue("attributes.deposit", undefined)
        }}
        error={errors.listing_type?.message ? t(errors.listing_type.message) : undefined}
        placeholder={t("form.listing_type_placeholder")}
      />

      <Select
        label={t("form.property_type_label")}
        required
        options={propertyTypes.map(type => ({ value: type, label: t(`constants.property_type_${type}`) }))}
        value={watch("property_type")}
        onChange={(val) => setValue("property_type", val as ListingFormValues["property_type"], { shouldValidate: true })}
        error={errors.property_type?.message ? t(errors.property_type.message) : undefined}
        placeholder={t("form.property_type_placeholder")}
      />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CurrencyInput
            label={t("form.price_label")}
            required
            value={value}
            onChange={onChange}
            error={error?.message ? t(error.message) : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="area"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            label={t("form.area_label")}
            required
            value={value ? Number(value).toLocaleString("en-US") : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "")
              if (/^\d*$/.test(raw)) onChange(raw ? Number(raw) : undefined)
            }}
            error={error?.message ? t(error.message) : undefined}
          />
        )}
      />

      {listingType === "rent" && (
        <>
          <Select
            label={t("form.rent_period_label")}
            options={[
              { label: t("form.rent_period_month"), value: "month" },
              { label: t("form.rent_period_year"), value: "year" }
            ]}
            value={(watch("attributes.rent_period") as string) || ""}
            onChange={(val) => setValue("attributes.rent_period", val)}
            placeholder={t("form.rent_period_placeholder")}
          />

          <Controller
            control={control}
            name="attributes.deposit"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                label={t("form.deposit_label")}
                value={value as number | undefined}
                onChange={onChange}
              />
            )}
          />
        </>
      )}

      <div className="md:col-span-2">
        <Textarea 
          {...register("description")} 
          label={t("form.description_label")}
          rows={5} 
          error={errors.description?.message ? t(errors.description.message) : undefined}
        />
      </div>
    </div>
  )
}
