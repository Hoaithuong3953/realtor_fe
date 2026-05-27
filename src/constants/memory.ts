import { PenLine, Sparkles, MessageCircle, FileText } from "lucide-react"

import type { MemorySourceUIConfig } from "@/types/ui"

export const MEMORY_SOURCE_MAP: Record<string, MemorySourceUIConfig> = {
  broker: {
    icon: PenLine,
    tooltipKey: "constants.source_broker",
  },
  ai: {
    icon: Sparkles,
    tooltipKey: "constants.source_ai",
  },
  zalo: {
    icon: MessageCircle,
    tooltipKey: "constants.source_zalo",
  },
  document: {
    icon: FileText,
    tooltipKey: "constants.source_document",
  },
}
