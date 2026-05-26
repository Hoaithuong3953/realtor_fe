import { useNavigate } from "react-router-dom"
import { useCreateListingMutation } from "@/hooks/listings/use-listings"
import { PropertyForm } from "@/components/organisms/listings"
import { type ListingFormValues } from "@/schemas/listing.schema"
import { paths } from "@/routes/paths"
import { LISTING_TYPES, PROPERTY_TYPES } from "@/types/api"

export default function PropertiesCreatePage() {
  const navigate = useNavigate()
  const { mutate, isPending } = useCreateListingMutation()

  const handleSubmit = (data: ListingFormValues) => {
    mutate(data, {
      onSuccess: () => {
        // Redirect to properties list on success
        void navigate(paths.dashboard.properties.root)
      }
    })
  }

  return (
    <div className="container mx-auto py-8">
      <PropertyForm 
        onSubmit={handleSubmit} 
        isPending={isPending} 
        listingTypes={LISTING_TYPES}
        propertyTypes={PROPERTY_TYPES}
        onCancel={() => navigate(paths.dashboard.properties.root)}
      />
    </div>
  )
}
