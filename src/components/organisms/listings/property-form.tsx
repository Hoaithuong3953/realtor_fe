import * as React from "react"
import { useForm, type Path, type Resolver, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { Save, ChevronRight, ChevronLeft } from "lucide-react"

import { Button } from "@/components/atoms"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { listingCreateSchema, type ListingFormValues } from "@/schemas/listing.schema"
import { useListingDraftStore } from "@/store/listing-draft.store"
import { PROPERTY_FORM_STEPS } from "@/constants/listing"

import { BasicInfoStep, LocationStep, DetailsStep, MediaStep } from "./property-form-steps"
import { useCustomAttributes } from "@/hooks/listings/use-custom-attributes"

interface PropertyFormProps {
  onSubmit: (data: ListingFormValues) => void
  isPending?: boolean
  listingTypes: readonly string[]
  propertyTypes: readonly string[]
  defaultValues?: Partial<ListingFormValues>
  isEditing?: boolean
  onCancel?: () => void
}

export const PropertyForm = ({ 
  onSubmit, 
  isPending,
  listingTypes,
  propertyTypes,
  defaultValues,
  isEditing,
  onCancel
}: PropertyFormProps) => {
  const { t } = useTranslation(["listing", "common"])
  const { draft, setDraft, clearDraft } = useListingDraftStore()
  
  const [currentStep, setCurrentStep] = React.useState(0)
  
  const {
    customFields,
    addCustomField,
    updateCustomFieldKey,
    updateCustomFieldCustomKey,
    updateCustomFieldValue,
    removeCustomField,
    mergeCustomFields
  } = useCustomAttributes(defaultValues?.attributes || draft?.attributes)

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingCreateSchema) as unknown as Resolver<ListingFormValues>,
    defaultValues: defaultValues || draft || {
      title: "",
      description: "",
      price: 0,
      area: 0,
      listing_type: "sale",
      property_type: "apartment",
      status: "draft",
      address_text: "",
      tags: [],
      attributes: {},
    },
    mode: "onChange",
  })

  const listingType = form.watch("listing_type")

  // Auto-save draft on form change
  React.useEffect(() => {
    const subscription = form.watch((value: unknown) => {
      setDraft(value as Partial<ListingFormValues>)
    })
    return () => subscription.unsubscribe()
  }, [form, setDraft])

  const handleSubmit = (values: ListingFormValues) => {
    values = mergeCustomFields(values)
    values.status = "active"
    onSubmit(values)
    clearDraft()
  }

  const handleSaveDraft = () => {
    let values = form.getValues()
    values = mergeCustomFields(values)
    values.status = "draft"
    onSubmit(values)
    clearDraft()
  }

  const handleCancel = () => {
    clearDraft()
    if (onCancel) onCancel()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && currentStep !== PROPERTY_FORM_STEPS.length - 1) {
      e.preventDefault()
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: Path<ListingFormValues>[] = []
    
    if (currentStep === 0) {
      fieldsToValidate = ["title", "listing_type", "property_type", "price", "area", "description"]
      if (listingType === "rent") {
        fieldsToValidate.push("attributes.rent_period", "attributes.deposit")
      }
    } else if (currentStep === 1) {
      fieldsToValidate = ["address_text"]
    } else if (currentStep === 2) {
      fieldsToValidate = []
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((s) => Math.min(s + 1, PROPERTY_FORM_STEPS.length - 1))
    }
  }
  
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0))

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{isEditing ? t("edit.title") : t("form.title")}</CardTitle>
            <CardDescription>
              {t("form.step")} {currentStep + 1} / {PROPERTY_FORM_STEPS.length}: {t(PROPERTY_FORM_STEPS[currentStep].label)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onCancel && (
              <Button variant="ghost" size="sm" type="button" onClick={handleCancel} disabled={isPending}>
                {t("actions.cancel", { ns: "common" })}
              </Button>
            )}
            <Button variant="outline" size="sm" type="button" onClick={handleSaveDraft} disabled={isPending}>
              {t("actions.save_draft", { ns: "common" })}
            </Button>
          </div>
        </div>
        
        {/* Stepper Header */}
        <div className="flex gap-2 mt-4">
          {PROPERTY_FORM_STEPS.map((step, index) => (
            <div 
              key={step.id} 
              className={`h-2 flex-1 rounded-full ${index <= currentStep ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form id="property-form" onKeyDown={handleKeyDown} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {currentStep === 0 && (
              <BasicInfoStep 
                listingTypes={listingTypes} 
                propertyTypes={propertyTypes} 
              />
            )}
            {currentStep === 1 && <LocationStep />}
            {currentStep === 2 && (
              <DetailsStep 
                customFields={customFields} 
                addCustomField={addCustomField}
                updateCustomFieldKey={updateCustomFieldKey}
                updateCustomFieldCustomKey={updateCustomFieldCustomKey}
                updateCustomFieldValue={updateCustomFieldValue}
                removeCustomField={removeCustomField}
              />
            )}
            {currentStep === 3 && <MediaStep />}
          </form>
        </FormProvider>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 0 || isPending}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t("actions.back", { ns: "common" })}
        </Button>

        {currentStep < PROPERTY_FORM_STEPS.length - 1 && (
          <Button key="btn-next" type="button" onClick={() => { void nextStep() }}>
            {t("actions.next", { ns: "common" })}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        {currentStep === PROPERTY_FORM_STEPS.length - 1 && (
          <Button key="btn-submit" type="submit" form="property-form" disabled={isPending}>
            <Save className="w-4 h-4 mr-2" />
            {t("actions.save", { ns: "common" })}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
