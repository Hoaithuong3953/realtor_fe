export interface ClientFormData {
  full_name: string
  phone?: string | null
  email?: string | null
  customer_type?: "buyer" | "seller" | "renter" | "landlord"
  goal_type?: "buy" | "rent" | "sell" | "lease"
  budget_min?: number | null
  budget_max?: number | null
  status?: "new" | "contacted" | "qualified" | "closed" | "archived"
  summary?: string | null
}

export interface ClientUiModel extends ClientFormData {
  id: number
  created_at: string
  updated_at: string
}

export type ClientAction = {
  id: string
  label: string
  icon?: React.ElementType
  variant?: "solid" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  onClick?: (e: React.MouseEvent) => void
  confirmTitle?: string
  confirmDescription?: string
  isPrimary?: boolean
}

export type ClientFieldConfig = {
  key: keyof ClientFormData
  label: string
  format?: (value: unknown) => string | React.ReactNode
}