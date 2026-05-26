import * as React from "react"
import { type ListingFormValues } from "@/schemas/listing.schema"

export function useCustomAttributes(initialAttributes: Record<string, unknown> = {}) {
  const [customFields, setCustomFields] = React.useState<{key: string, value: string}[]>(() => {
    const custom = [];
    for (const [k, v] of Object.entries(initialAttributes)) {
      if (k !== "rent_period" && k !== "deposit") {
        custom.push({ key: k, value: String(v) })
      }
    }
    return custom;
  })

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }])
  }

  const updateCustomFieldKey = (index: number, key: string) => {
    const newFields = [...customFields]
    newFields[index].key = key
    setCustomFields(newFields)
  }

  const updateCustomFieldValue = (index: number, value: string) => {
    const newFields = [...customFields]
    newFields[index].value = value
    setCustomFields(newFields)
  }

  const removeCustomField = (index: number) => {
    const newFields = customFields.filter((_, i) => i !== index)
    setCustomFields(newFields)
  }

  const mergeCustomFields = (values: ListingFormValues) => {
    const attrs = { ...values.attributes }
    customFields.forEach(field => {
       if (field.key && field.value) {
         attrs[field.key] = field.value
       }
    })
    values.attributes = attrs
    return values
  }

  return {
    customFields,
    addCustomField,
    updateCustomFieldKey,
    updateCustomFieldValue,
    removeCustomField,
    mergeCustomFields
  }
}
