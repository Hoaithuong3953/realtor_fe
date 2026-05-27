import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type {
  ChatMessageCreate,
  ChatMessageListResponse,
  ChatMessageResponse,
  ChatSessionCreate,
  ChatSessionListResponse,
  ChatSessionResponse,
  ChatSessionUpdate,
  MemoryItem,
} from "@/types/api/chat"

export const chatService = {
  /**
   * List chat sessions
   * [GET] /chat/sessions
   */
  listSessions: async (limit = 20, offset = 0): Promise<ChatSessionListResponse> => {
    const response = await apiClient.get<ChatSessionListResponse>(
      API_ENDPOINTS.CHAT.SESSIONS,
      { params: { limit, offset } }
    )
    return response.data
  },

  /**
   * Create a new chat session
   * [POST] /chat/sessions
   */
  createSession: async (payload: ChatSessionCreate): Promise<ChatSessionResponse> => {
    const response = await apiClient.post<ChatSessionResponse>(
      API_ENDPOINTS.CHAT.SESSIONS,
      payload
    )
    return response.data
  },

  /**
   * Get chat session detail
   * [GET] /chat/sessions/{id}
   */
  getSession: async (sessionId: string | number): Promise<ChatSessionResponse> => {
    const response = await apiClient.get<ChatSessionResponse>(
      API_ENDPOINTS.CHAT.SESSION_DETAIL(sessionId)
    )
    return response.data
  },

  /**
   * List chat messages for a session
   * [GET] /chat/sessions/{id}/messages
   */
  listMessages: async (sessionId: string | number, limit = 50): Promise<ChatMessageListResponse> => {
    const response = await apiClient.get<ChatMessageListResponse>(
      API_ENDPOINTS.CHAT.SESSION_MESSAGES(sessionId),
      { params: { limit } }
    )
    return response.data
  },

  /**
   * Send a message to AI
   * [POST] /chat/messages/ai
   */
  sendMessageAI: async (payload: ChatMessageCreate): Promise<ChatMessageResponse> => {
    const response = await apiClient.post<ChatMessageResponse>(
      API_ENDPOINTS.CHAT.MESSAGE_AI,
      payload,
      { timeout: API_CONFIG.AI_TIMEOUT }
    )
    return response.data
  },

  /**
   * Get session memories
   * [GET] /chat/sessions/{id}/memories
   */
  getSessionMemories: async (sessionId: string | number): Promise<MemoryItem[]> => {
    const response = await apiClient.get<MemoryItem[]>(
      API_ENDPOINTS.CHAT.SESSION_MEMORIES(sessionId)
    )
    return response.data
  },

  /**
   * Delete a memory
   * [DELETE] /chat/memories/{id}
   */
  deleteMemory: async (memoryId: string | number): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      API_ENDPOINTS.CHAT.MEMORY_DETAIL(memoryId)
    )
    return response.data
  },

  /**
   * Reset session memory
   * [POST] /chat/sessions/{id}/reset-memory
   */
  resetSessionMemory: async (sessionId: string | number): Promise<ChatSessionResponse> => {
    const response = await apiClient.post<ChatSessionResponse>(
      API_ENDPOINTS.CHAT.SESSION_RESET_MEMORY(sessionId)
    )
    return response.data
  },

  /**
   * Update chat session
   * [PATCH] /chat/sessions/{id}
   */
  updateSession: async (sessionId: string | number, payload: ChatSessionUpdate): Promise<ChatSessionResponse> => {
    const response = await apiClient.patch<ChatSessionResponse>(
      API_ENDPOINTS.CHAT.SESSION_DETAIL(sessionId),
      payload
    )
    return response.data
  },

  /**
   * Delete chat session
   * [DELETE] /chat/sessions/{id}
   */
  deleteSession: async (sessionId: string | number): Promise<boolean> => {
    const response = await apiClient.delete<boolean>(
      API_ENDPOINTS.CHAT.SESSION_DETAIL(sessionId)
    )
    return response.data
  },
}
