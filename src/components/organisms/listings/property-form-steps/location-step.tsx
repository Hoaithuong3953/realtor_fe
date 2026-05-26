
import { useFormContext, Controller } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Input } from "@/components/atoms"
import { Select } from "@/components/molecules"
import { type ListingFormValues } from "@/schemas/listing.schema"

import { useLocationData } from "@/hooks/listings/use-location-data"

export const LocationStep = () => {
  const { t } = useTranslation(["listing", "common"])
  const { register, control, watch, formState: { errors } } = useFormContext<ListingFormValues>()

  const {
    provinces,
    wards,
    handleProvinceChange,
    handleWardChange,
    handleDetailChange
  } = useLocationData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label={t("form.province_label")}
          required
          options={provinces.map((p) => ({ value: String(p.code), label: p.name }))}
          value={(watch("location_json.province_code") as string) || ""}
          onChange={handleProvinceChange}
          placeholder={t("form.province_placeholder")}
        />

        <Select
          label={t("form.ward_label")}
          required
          disabled={!watch("location_json.province_code")}
          options={wards.map((w) => ({ value: String(w.code), label: w.name }))}
          value={(watch("location_json.ward_code") as string) || ""}
          onChange={handleWardChange}
          placeholder={t("form.ward_placeholder")}
        />
      </div>

      <Controller
        control={control}
        name="location_json.detail"
        render={({ field: { onChange, value } }) => (
          <Input 
            label={t("form.detail_address_label")}
            required
            placeholder={t("form.detail_address_placeholder")} 
            value={typeof value === "string" ? value : ""}
            onChange={(e) => {
              onChange(e.target.value)
              handleDetailChange(e.target.value)
            }}
          />
        )}
      />

      <div className="hidden">
        <Input 
          {...register("address_text")} 
        />
      </div>

      {errors.address_text?.message && (
        <p className="text-[0.8rem] font-medium text-destructive mt-2">
          {t(errors.address_text.message)}
        </p>
      )}

      <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground">
        {t("form.address_hint")}
      </div>
    </div>
  )
}
