import { create } from "zustand"
import type { ClientResponse } from "@/types/api/client"

type ChatState = {
  sessionId: string | null
  activeClient: ClientResponse | null
  isMemoryOpen: boolean
  isTyping: boolean
  memories: { id: string, content: string, source?: string }[]

  // Actions
  setSessionId: (id: string | null) => void
  setActiveClient: (client: ClientResponse | null) => void
  setIsMemoryOpen: (isOpen: boolean) => void
  setIsTyping: (isTyping: boolean) => void
  setMemories: (memories: { id: string, content: string, source?: string }[]) => void

  resetSession: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  sessionId: null,
  activeClient: null,
  isMemoryOpen: false,
  isTyping: false,
  memories: [],

  setSessionId: (id) => set({ sessionId: id }),
  setActiveClient: (client) => set({ activeClient: client }),
  setIsMemoryOpen: (isOpen) => set({ isMemoryOpen: isOpen }),
  setIsTyping: (isTyping) => set({ isTyping }),
  setMemories: (memories) => set({ memories }),

  resetSession: () =>
    set({
      activeClient: null,
      isMemoryOpen: false,
      isTyping: false,
    }),
}))
