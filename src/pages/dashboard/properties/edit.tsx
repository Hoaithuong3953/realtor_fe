import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useUpdateListingMutation, useListingDetailQuery } from "@/hooks/listings/use-listings"
import { PropertyForm } from "@/components/organisms/listings"
import { type ListingFormValues } from "@/schemas/listing.schema"
import { paths } from "@/routes/paths"
import { LISTING_TYPES, PROPERTY_TYPES } from "@/types/api"
import { LoadingScreen } from "@/components/molecules"

export default function PropertiesEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation(["listing"])
  
  const { data: listing, isLoading } = useListingDetailQuery(id as string)
  const { mutate, isPending } = useUpdateListingMutation()

  const handleSubmit = (data: ListingFormValues) => {
    if (!id) return
    mutate(
      { id, data },
      {
        onSuccess: () => {
          // Redirect to properties list on success
          void navigate(paths.dashboard.properties.root)
        }
      }
    )
  }

  if (isLoading || !listing) {
    return <LoadingScreen />
  }

  // Map ListingResponse to ListingFormValues
  const defaultValues: Partial<ListingFormValues> = {
    title: listing.title,
    description: listing.description || "",
    price: listing.price || 0,
    area: listing.area || 0,
    listing_type: listing.listing_type,
    property_type: listing.property_type,
    status: listing.status || "draft",
    address_text: listing.address_text || "",
    location_json: listing.location_json || {},
    geo: listing.geo || {},
    tags: listing.tags || [],
    attributes: listing.attributes || {},
    media: listing.media || []
  }

  return (
    <div className="container mx-auto py-8">
      <PropertyForm 
        isEditing={true}
        onSubmit={handleSubmit} 
        isPending={isPending} 
        listingTypes={LISTING_TYPES}
        propertyTypes={PROPERTY_TYPES}
        defaultValues={defaultValues}
        onCancel={() => navigate(paths.dashboard.properties.root)}
      />
    </div>
  )
}
