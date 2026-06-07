import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import { CHAT_STREAM_EVENTS } from "@/constants/chat"
import { apiClient } from "@/lib/api-client"
import { sseClient } from "@/lib/sse-client"
import type {
  ChatMessageCreate,
  ChatMessageListResponse,
  ChatMessageResponse,
  ChatSessionCreate,
  ChatSessionListResponse,
  ChatSessionResponse,
  ChatSessionUpdate,
  AggregatedMemoryResponse,
  ChatStreamCallbacks,
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
   * Get session aggregated memory
   * [GET] /chat/sessions/{id}/memories
   */
  getSessionMemories: async (sessionId: string | number): Promise<AggregatedMemoryResponse | null> => {
    const response = await apiClient.get<AggregatedMemoryResponse | null>(
      API_ENDPOINTS.CHAT.SESSION_MEMORIES(sessionId)
    )
    return response.data
  },

  /**
   * Initialize / Compile aggregated memory
   * [POST] /chat/sessions/{id}/initialize-memory
   */
  initializeMemory: async (sessionId: string | number): Promise<ChatSessionResponse> => {
    if (!sessionId) {
      throw new Error("Session ID is required to initialize memory")
    }
    const response = await apiClient.post<ChatSessionResponse>(
      API_ENDPOINTS.CHAT.SESSION_INITIALIZE_MEMORY(sessionId)
    )
    return response.data
  },

  /**
   * Reset session memory
   * [POST] /chat/sessions/{id}/reset-memory
   */
  resetSessionMemory: async (sessionId: string | number): Promise<ChatSessionResponse> => {
    if (!sessionId) {
      throw new Error("Session ID is required to reset memory")
    }
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
  
  /**
   * Send a message to AI using Server-Sent Events (SSE) streaming
   * [POST] /chat/messages/ai
   */
  sendMessageAIStream: async (
    payload: ChatMessageCreate,
    callbacks: ChatStreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> => {
    try {
      await sseClient.stream(API_ENDPOINTS.CHAT.MESSAGE_AI, {
        method: "POST",
        body: { ...payload, stream: true },
        signal,
        onMessage(ev) {
          if (ev.event === CHAT_STREAM_EVENTS.TOKEN) {
            const parsed = JSON.parse(ev.data) as { text?: string }
            callbacks.onToken?.(parsed.text || "")
          } else if (ev.event === CHAT_STREAM_EVENTS.INTENT) {
            const parsed = JSON.parse(ev.data) as { intent: string; confidence: number }
            callbacks.onIntent?.(parsed)
          } else if (ev.event === CHAT_STREAM_EVENTS.MESSAGE) {
            const parsed = JSON.parse(ev.data) as ChatMessageResponse
            callbacks.onMessage?.(parsed)
          } else if (ev.event === CHAT_STREAM_EVENTS.ERROR) {
            const parsed = JSON.parse(ev.data) as { detail?: string }
            callbacks.onError?.(new Error(parsed.detail || "Unknown AI error"))
          }
        },
        onError(err) {
          if (callbacks.onError) {
            callbacks.onError(err instanceof Error ? err : new Error(String(err)))
          }
        },
        onClose() {
          if (callbacks.onClose) callbacks.onClose()
        }
      })
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        callbacks.onError?.(err)
      } else if (!(err instanceof Error)) {
        callbacks.onError?.(new Error(String(err)))
      }
    }
  },
}
