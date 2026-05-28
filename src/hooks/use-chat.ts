import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { chatService } from "@/services/chat.service"
import { useTranslation } from "react-i18next"
import type { ChatSessionCreate, ChatSessionUpdate, ChatMessageCreate } from "@/types/api/chat"

export const CHAT_KEYS = {
  all: ["chat"] as const,
  sessions: () => [...CHAT_KEYS.all, "sessions"] as const,
  session: (id: string | number) => [...CHAT_KEYS.sessions(), id] as const,
  messages: (id: string | number) => [...CHAT_KEYS.session(id), "messages"] as const,
  memories: (id: string | number) => [...CHAT_KEYS.session(id), "memories"] as const,
}

export const useChatSessionsQuery = (limit = 20, offset = 0, enabled = true) => {
  return useQuery({
    queryKey: [...CHAT_KEYS.sessions(), limit, offset],
    queryFn: () => chatService.listSessions(limit, offset),
    enabled
  })
}

export const useChatSessionQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CHAT_KEYS.session(id!),
    queryFn: () => chatService.getSession(id!),
    enabled: !!id && enabled,
  })
}

export const useChatMessagesQuery = (id: string | number | undefined, limit = 50, enabled = true) => {
  return useQuery({
    queryKey: [...CHAT_KEYS.messages(id!), limit],
    queryFn: () => chatService.listMessages(id!, limit),
    enabled: !!id && enabled,
  })
}

export const useChatMemoriesQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CHAT_KEYS.memories(id!),
    queryFn: () => chatService.getSessionMemories(id!),
    enabled: !!id && enabled,
  })
}

export const useCreateChatSessionMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("chat")
  return useMutation({
    mutationFn: (data: ChatSessionCreate) => chatService.createSession(data),
    meta: {
      customErrorMsg: t("messages.create_session_error")
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions() })
    }
  })
}

export const useUpdateChatSessionMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ChatSessionUpdate) => chatService.updateSession(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.session(id) })
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions() })
    },
  })
}

export const useDeleteChatSessionMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("chat")
  return useMutation({
    mutationFn: (id: string | number) => chatService.deleteSession(id),
    meta: {
      customErrorMsg: t("messages.delete_session_error")
    },
    onSuccess: () => {
      toast.success(t("messages.delete_session_success"))
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.sessions() })
    }
  })
}

export const useSendMessageMutation = (sessionId?: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("chat")
  return useMutation({
    mutationFn: (data: Omit<ChatMessageCreate, "session_id"> & { session_id?: number }) => 
      chatService.sendMessageAI({ ...data, session_id: data.session_id || Number(sessionId) }),
    meta: {
      customErrorMsg: t("messages.send_message_error")
    },
    onSuccess: (_, variables) => {
      const targetSessionId = variables.session_id || sessionId
      if (targetSessionId) {
        void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.messages(targetSessionId) })
        void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.memories(targetSessionId) })
      }
    }
  })
}

export const useInitializeMemoryMutation = (sessionId: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("chat")
  return useMutation({
    mutationFn: () => chatService.initializeMemory(sessionId),
    meta: {
      customErrorMsg: t("messages.memory_reset_error") // We can reuse the error or create a new one, let's just reuse error for now. Or better: "Không thể tổng hợp ký ức"
    },
    onSuccess: () => {
      toast.success(t("messages.memory_compiled_success", { defaultValue: "Đã tổng hợp bộ nhớ thành công!" }))
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.memories(sessionId) })
    }
  })
}

export const useResetMemoryMutation = (sessionId: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("chat")
  return useMutation({
    mutationFn: () => chatService.resetSessionMemory(sessionId),
    meta: {
      customErrorMsg: t("messages.memory_reset_error")
    },
    onSuccess: () => {
      toast.success(t("messages.memory_reset_success"))
      void queryClient.invalidateQueries({ queryKey: CHAT_KEYS.memories(sessionId) })
    }
  })
}
