import * as React from "react"
import { type ListingFormValues } from "@/schemas/listing.schema"

import { ATTRIBUTE_CONFIG } from "@/constants/listing"

export function useCustomAttributes(initialAttributes: Record<string, unknown> = {}) {
  const [customFields, setCustomFields] = React.useState<{key: string, customKey?: string, value: string}[]>(() => {
    const custom = [];
    for (const [k, v] of Object.entries(initialAttributes)) {
      if (k === "extra_features" && Array.isArray(v)) {
        v.forEach(feature => {
          if (typeof feature === "string") {
            const parts = feature.split(":");
            if (parts.length > 1) {
              const key = parts[0].trim();
              const val = parts.slice(1).join(":").trim();
              custom.push({ key: "_custom", customKey: key, value: val });
            } else {
              custom.push({ key: "_custom", customKey: feature, value: "" });
            }
          }
        });
      } else if (k !== "rent_period" && k !== "deposit") {
        if (ATTRIBUTE_CONFIG[k]) {
          custom.push({ key: k, value: String(v) })
        } else {
          // Backward compatibility for old DB records
          custom.push({ key: "_custom", customKey: k, value: String(v) })
        }
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
    if (key !== "_custom") {
      newFields[index].customKey = ""
    }
    setCustomFields(newFields)
  }

  const updateCustomFieldCustomKey = (index: number, customKey: string) => {
    const newFields = [...customFields]
    newFields[index].customKey = customKey
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
    const extraFeatures: string[] = []

    // Clean up old custom keys and reset extra_features
    delete attrs.extra_features
    Object.keys(attrs).forEach(k => {
      if (k !== "rent_period" && k !== "deposit" && !ATTRIBUTE_CONFIG[k]) {
        delete attrs[k]
      }
    })

    customFields.forEach(field => {
       if (field.key === "_custom") {
         if (field.customKey) {
           const valPart = field.value ? `: ${field.value}` : ""
           extraFeatures.push(`${field.customKey}${valPart}`)
         }
       } else if (field.key && field.value) {
         attrs[field.key] = field.value
       }
    })

    if (extraFeatures.length > 0) {
      attrs.extra_features = extraFeatures
    }

    values.attributes = attrs
    return values
  }

  return {
    customFields,
    addCustomField,
    updateCustomFieldKey,
    updateCustomFieldCustomKey,
    updateCustomFieldValue,
    removeCustomField,
    mergeCustomFields
  }
}
