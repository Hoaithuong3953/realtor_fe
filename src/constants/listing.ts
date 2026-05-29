import { BedDouble, Bath, Compass, Layers, Ruler, Car, Home, FileText } from "lucide-react"
import type { AttributeConfigData } from "@/types/ui/property"

export const PROPERTY_FORM_STEPS = [
  { id: "basic", label: "form.step_basic" },
  { id: "location", label: "form.step_location" },
  { id: "details", label: "form.step_details" },
  { id: "media", label: "form.step_media" },
]

const DIRECTION_OPTIONS = [
  { value: "Đông", label: "Đông" },
  { value: "Tây", label: "Tây" },
  { value: "Nam", label: "Nam" },
  { value: "Bắc", label: "Bắc" },
  { value: "Đông Bắc", label: "Đông Bắc" },
  { value: "Đông Nam", label: "Đông Nam" },
  { value: "Tây Bắc", label: "Tây Bắc" },
  { value: "Tây Nam", label: "Tây Nam" },
];

const LEGAL_OPTIONS = [
  { value: "Sổ đỏ/Sổ hồng", label: "Sổ đỏ/Sổ hồng" },
  { value: "Hợp đồng mua bán", label: "Hợp đồng mua bán" },
  { value: "Giấy tay", label: "Giấy tay" },
  { value: "Đang chờ sổ", label: "Đang chờ sổ" },
];

const FURNITURE_OPTIONS = [
  { value: "Cơ bản", label: "Cơ bản" },
  { value: "Đầy đủ", label: "Đầy đủ" },
  { value: "Bàn giao thô", label: "Bàn giao thô" },
  { value: "Nhà trống", label: "Nhà trống" },
];

export const ATTRIBUTE_CONFIG: Record<string, AttributeConfigData> = {
  room: { label: "attributes.bedrooms_label", shortLabel: "attributes.bedrooms_shortLabel", icon: BedDouble, type: "number", placeholder: "attributes.bedrooms_placeholder" },
  toilet: { label: "attributes.bathrooms_label", shortLabel: "attributes.bathrooms_shortLabel", icon: Bath, type: "number", placeholder: "attributes.bathrooms_placeholder" },
  direction: { label: "attributes.direction_label", shortLabel: "attributes.direction_shortLabel", icon: Compass, type: "select", options: DIRECTION_OPTIONS, placeholder: "attributes.direction_placeholder" },
  balcony_direction: { label: "attributes.balcony_direction_label", shortLabel: "attributes.balcony_direction_shortLabel", icon: Compass, type: "select", options: DIRECTION_OPTIONS, placeholder: "attributes.balcony_direction_placeholder" },
  floor: { label: "attributes.floors_label", shortLabel: "attributes.floors_shortLabel", icon: Layers, type: "number", placeholder: "attributes.floors_placeholder" },
  front: { label: "attributes.frontage_label", shortLabel: "attributes.frontage_shortLabel", icon: Ruler, type: "number", placeholder: "attributes.frontage_placeholder" },
  road_width: { label: "attributes.alley_width_label", shortLabel: "attributes.alley_width_shortLabel", icon: Car, type: "number", placeholder: "attributes.alley_width_placeholder" },
  furniture: { label: "attributes.furniture_label", shortLabel: "attributes.furniture_shortLabel", icon: Home, type: "select", options: FURNITURE_OPTIONS, placeholder: "attributes.furniture_placeholder" },
  legal_status: { label: "attributes.legal_label", shortLabel: "attributes.legal_shortLabel", icon: FileText, type: "select", options: LEGAL_OPTIONS, placeholder: "attributes.legal_placeholder" },
}

export const EXCLUDED_CARD_ATTRIBUTES = ["deposit", "rent_period"]

export const LISTING_SORT_OPTIONS = [
  { label: "sort.newest", value: "updated_at_desc" },
  { label: "sort.oldest", value: "updated_at_asc" },
  { label: "sort.price_asc", value: "price_asc" },
  { label: "sort.price_desc", value: "price_desc" },
  { label: "sort.area_asc", value: "area_asc" },
  { label: "sort.area_desc", value: "area_desc" },
  { label: "sort.name_asc", value: "title_asc" },
  { label: "sort.name_desc", value: "title_desc" }
]