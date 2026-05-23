import type { ElementType } from "react"

export type NavItem = {
  title: string
  url: string
  icon?: ElementType
  isActive?: boolean
  items?: NavSubItem[]
}

export type NavSubItem = {
  title: string
  url: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}
