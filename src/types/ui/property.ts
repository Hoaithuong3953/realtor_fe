import type React from "react"

export type PropertyAction = {
  id: string
  label: string
  icon?: React.ElementType
  variant?: "solid" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  onClick?: (e: React.MouseEvent) => void
  confirmTitle?: string
  confirmDescription?: string
  isPrimary?: boolean
}

export type PropertyItemData = {
  id?: string | number
  title: string
  price?: number
  address_text?: string
  listing_type?: "sale" | "rent"
  property_type?: "apartment" | "house" | "villa" | "land"
  status?: "active" | "draft" | "inactive"
  area?: number
  media?: Array<{ url: string; [key: string]: unknown }>
  tags?: string[]
  updated_at?: string
  attributes?: {
    rent_period?: string
    bedrooms?: number | string
    bathrooms?: number | string
    [key: string]: unknown
  }
}

export type AttributeConfigData = {
  label: string;
  shortLabel?: string;
  icon?: React.ElementType;
  type?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}
