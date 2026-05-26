export interface UserFormData {
  email: string
  password?: string
  full_name: string
  phone?: string | null
  role_id?: number | null
  status?: "active" | "inactive" | "locked"
}

export type UserFieldConfig = {
  key: keyof UserFormData
  label: string
  format?: (value: unknown) => string | React.ReactNode
}

export interface UserUiModel extends Omit<UserFormData, 'password'> {
  id: number
  tenant_id?: number | null
  role_code?: "SUPER_ADMIN" | "TENANT_ADMIN" | "BROKER" | null
}

export type UserAction = {
  id: string
  label: string
  icon?: React.ElementType
  variant?: "solid" | "secondary" | "outline" | "ghost" | "destructive" | "link"
  onClick?: (e: React.MouseEvent) => void
  confirmTitle?: string
  confirmDescription?: string
  isPrimary?: boolean
}
