export interface ChatMessageCreate {
  session_id: number;
  content: string;
  message_type?: "text" | "image" | "tool_call" | "system";
  meta_data?: Record<string, unknown>;
}

export interface ChatMessageListResponse {
  items: ChatMessageResponse[];
  total: number;
}

export interface ChatMessageResponse {
  id: number;
  session_id: number;
  sender_type: "user" | "ai" | "system";
  sender_user_id?: number | null;
  message_type: "text" | "image" | "tool_call" | "system";
  content: string;
  meta_data?: Record<string, unknown>;
  created_at: string;
}

export interface ChatSessionCreate {
  title?: string | null;
  client_id?: number | null;
  context_json?: Record<string, unknown>;
}

export interface ChatSessionListResponse {
  items: ChatSessionResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface ChatSessionResponse {
  id: number;
  tenant_id: number;
  broker_user_id: number;
  client_id?: number | null;
  title?: string | null;
  status: string;
  summary_text?: string | null;
  context_json?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionUpdate {
  title?: string | null;
  client_id?: number | null;
}

export type MemoryItem = {
  id: string
  content: string
  source?: string
}