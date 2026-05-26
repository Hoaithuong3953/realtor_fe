import { z } from "zod"
import { LISTING_TYPES, PROPERTY_TYPES, LISTING_STATUSES } from "@/types/api"

export const listingCreateSchema = z.object({
  title: z
    .string({ message: "validation.title_required" })
    .min(1, { message: "validation.title_required" })
    .max(255, { message: "validation.title_max_length" }),
  description: z.string().nullable().optional(),
  price: z.coerce
    .number({ message: "validation.price_must_be_number" })
    .min(1, { message: "validation.price_min_0" }),
  area: z.coerce
    .number({ message: "validation.area_must_be_number" })
    .min(1, { message: "validation.area_min_0" }),
  listing_type: z.enum(LISTING_TYPES, {
    message: "validation.listing_type_invalid"
  }),
  property_type: z.enum(PROPERTY_TYPES, {
    message: "validation.property_type_invalid"
  }),
  status: z.enum(LISTING_STATUSES, {
    message: "validation.status_invalid"
  }).optional().default("draft"),
  address_text: z
    .string({ message: "validation.address_required" })
    .min(5, { message: "validation.address_required" }),
  location_json: z.record(z.string(), z.unknown()).optional().default({}),
  geo: z.record(z.string(), z.unknown()).optional().default({}),
  tags: z.array(z.string()).optional().default([]),
  attributes: z.record(z.string(), z.unknown()).optional().default({}),
  media: z.array(z.record(z.string(), z.unknown())).optional().default([])
})

export type ListingFormValues = z.infer<typeof listingCreateSchema>
