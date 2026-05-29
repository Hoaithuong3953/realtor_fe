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
  summary_text?: Record<string, unknown> | null;
  aggregated_memory?: AggregatedMemoryResponse | null;
  context_json?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionUpdate {
  title?: string | null;
  client_id?: number | null;
}

export interface AggregatedMemoryResponse {
  client_info?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  consolidated_requirements?: {
    budget_range?: string;
    locations?: string[];
    property_details?: string;
    special_notes?: string;
  };
  summary_status?: string;
}

export interface ChatStreamCallbacks {
  onToken?: (text: string) => void;
  onIntent?: (data: { intent: string; confidence: number }) => void;
  onMessage?: (data: ChatMessageResponse) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}