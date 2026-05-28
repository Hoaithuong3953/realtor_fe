import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Trash2, Plus } from "lucide-react"
import { Input, Button } from "@/components/atoms"
import { Select } from "@/components/molecules"
import { type ListingFormValues } from "@/schemas/listing.schema"
import { ATTRIBUTE_CONFIG } from "@/constants/listing"

interface DetailsStepProps {
  customFields: { key: string; customKey?: string; value: string }[]
  addCustomField: () => void
  updateCustomFieldKey: (index: number, key: string) => void
  updateCustomFieldCustomKey: (index: number, key: string) => void
  updateCustomFieldValue: (index: number, value: string) => void
  removeCustomField: (index: number) => void
}

export const DetailsStep = ({ 
  customFields, 
  addCustomField, 
  updateCustomFieldKey, 
  updateCustomFieldCustomKey,
  updateCustomFieldValue, 
  removeCustomField 
}: DetailsStepProps) => {
  const { t } = useTranslation(["listing", "common"])
  const { watch, setValue } = useFormContext<ListingFormValues>()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Input
          label={t("form.tags_label")}
          placeholder={t("form.tags_placeholder")}
          value={watch("tags")?.join(", ") || ""}
          onChange={(e) => {
            const val = e.target.value;
            setValue("tags", val ? val.split(",").map(t => t.trim()) : [], { shouldDirty: true });
          }}
        />
      </div>

      {/* Custom Attributes */}
      <div className="md:col-span-2 mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm">{t("form.custom_attributes_title")}</h4>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addCustomField}
          >
            <Plus className="w-4 h-4 mr-2" /> {t("form.add_attribute_btn")}
          </Button>
        </div>

        {customFields.map((field, index) => {
          const isCustom = field.key === "_custom";
          
          const options = Object.entries(ATTRIBUTE_CONFIG)
            .filter(([k]) => !customFields.some((f, i) => i !== index && f.key === k))
            .map(([k, conf]) => ({ value: k, label: t(conf.label) }));
            
          options.push({ value: "_custom", label: t("form.custom_attributes_other", { defaultValue: "Thuộc tính khác..." }) });

          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-1/3">
                {isCustom ? (
                  <Input
                    placeholder={t("form.custom_attributes_name_placeholder", { defaultValue: "Tên thuộc tính" })}
                    value={field.customKey || ""}
                    onChange={(e) => updateCustomFieldCustomKey(index, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <Select
                    className="w-full"
                    options={options}
                    value={field.key}
                    onChange={(val) => updateCustomFieldKey(index, val)}
                    placeholder={t("form.custom_attributes_select_placeholder")}
                  />
                )}
              </div>
              <div className="flex-1">
                {ATTRIBUTE_CONFIG[field.key]?.options ? (
                  <Select
                    className="w-full"
                    options={ATTRIBUTE_CONFIG[field.key].options}
                    value={field.value}
                    onChange={(val) => updateCustomFieldValue(index, val)}
                    placeholder={ATTRIBUTE_CONFIG[field.key]?.placeholder ? t(ATTRIBUTE_CONFIG[field.key].placeholder!) : t("form.custom_attributes_value_placeholder")}
                  />
                ) : (
                  <Input
                    className="w-full"
                    type={ATTRIBUTE_CONFIG[field.key]?.type || "text"}
                    value={field.value}
                    onChange={(e) => updateCustomFieldValue(index, e.target.value)}
                    placeholder={ATTRIBUTE_CONFIG[field.key]?.placeholder ? t(ATTRIBUTE_CONFIG[field.key].placeholder!) : t("form.custom_attributes_value_placeholder")}
                  />
                )}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="shrink-0"
                onClick={() => removeCustomField(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
