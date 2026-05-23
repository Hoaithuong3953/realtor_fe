import type { ElementType } from "react"
import type { MemoryItem } from "../api/chat"

export type MemorySourceUIConfig = {
  icon: ElementType
  tooltipKey: string
}

export type MemoryGroupUI = {
  id: string
  label: string
  icon: ElementType
  items: MemoryItem[]
}
