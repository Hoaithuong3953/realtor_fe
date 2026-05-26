import { BedDouble, Bath, Compass, Layers, Ruler, Car, Home, FileText } from "lucide-react"
import type { AttributeConfigData } from "@/types/ui/property"

export const PROPERTY_FORM_STEPS = [
  { id: "basic", label: "form.step_basic" },
  { id: "location", label: "form.step_location" },
  { id: "details", label: "form.step_details" },
  { id: "media", label: "form.step_media" },
]

export const ATTRIBUTE_CONFIG: Record<string, AttributeConfigData> = {
  bedrooms: { label: "attributes.bedrooms_label", shortLabel: "attributes.bedrooms_shortLabel", icon: BedDouble, type: "number", placeholder: "attributes.bedrooms_placeholder" },
  bathrooms: { label: "attributes.bathrooms_label", shortLabel: "attributes.bathrooms_shortLabel", icon: Bath, type: "number", placeholder: "attributes.bathrooms_placeholder" },
  direction: { label: "attributes.direction_label", shortLabel: "attributes.direction_shortLabel", icon: Compass, type: "text", placeholder: "attributes.direction_placeholder" },
  balcony_direction: { label: "attributes.balcony_direction_label", shortLabel: "attributes.balcony_direction_shortLabel", icon: Compass, type: "text", placeholder: "attributes.balcony_direction_placeholder" },
  floors: { label: "attributes.floors_label", shortLabel: "attributes.floors_shortLabel", icon: Layers, type: "number", placeholder: "attributes.floors_placeholder" },
  frontage: { label: "attributes.frontage_label", shortLabel: "attributes.frontage_shortLabel", icon: Ruler, type: "number", placeholder: "attributes.frontage_placeholder" },
  alley_width: { label: "attributes.alley_width_label", shortLabel: "attributes.alley_width_shortLabel", icon: Car, type: "number", placeholder: "attributes.alley_width_placeholder" },
  furniture: { label: "attributes.furniture_label", shortLabel: "attributes.furniture_shortLabel", icon: Home, type: "text", placeholder: "attributes.furniture_placeholder" },
  legal: { label: "attributes.legal_label", shortLabel: "attributes.legal_shortLabel", icon: FileText, type: "text", placeholder: "attributes.legal_placeholder" },
}

export const EXCLUDED_CARD_ATTRIBUTES = ["deposit", "rent_period"]
