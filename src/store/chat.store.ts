import { create } from "zustand"
import type { ClientResponse } from "@/types/api/client"
import type { AggregatedMemoryResponse } from "@/types/api/chat"

type ChatState = {
  sessionId: string | null
  activeClient: ClientResponse | null
  isMemoryOpen: boolean
  isTyping: boolean
  aggregatedMemory: AggregatedMemoryResponse | null

  // Actions
  setSessionId: (id: string | null) => void
  setActiveClient: (client: ClientResponse | null) => void
  setIsMemoryOpen: (isOpen: boolean) => void
  setIsTyping: (isTyping: boolean) => void
  setAggregatedMemory: (memory: AggregatedMemoryResponse | null) => void

  resetSession: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  activeClient: null,
  isMemoryOpen: false,
  isTyping: false,
  aggregatedMemory: null,

  setSessionId: (id) => set({ sessionId: id }),
  setActiveClient: (client) => set({ activeClient: client }),
  setIsMemoryOpen: (isOpen) => set({ isMemoryOpen: isOpen }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setAggregatedMemory: (memory) => set({ aggregatedMemory: memory }),

  resetSession: () =>
    set({
      activeClient: null,
      isMemoryOpen: false,
      isTyping: false,
    }),
}))
