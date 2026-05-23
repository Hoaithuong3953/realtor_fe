export interface ClientContextResponse {
  summary?: string | null;
  preference_json?: Record<string, unknown>;
  interaction_json?: Record<string, unknown>;
  recent_listings?: ClientSentListingResponse[];
}

export interface ClientCreate {
  full_name: string;
  phone?: string | null;
  email?: string | null;
  customer_type?: string;
  goal_type?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  status?: "new" | "qualified" | "contacted" | "closed" | "archived";
  summary?: string | null;
  preference_json?: Record<string, unknown>;
  interaction_json?: Record<string, unknown>;
}

export interface ClientInteractionCreate {
  type: "note" | "call" | "email" | "message" | "follow_up";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ClientInteractionEvent {
  type: "note" | "call" | "email" | "message" | "follow_up";
  content: string;
  actor_user_id: number;
  tenant_id: number;
  client_id: number;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface ClientListResponse {
  items: ClientResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface ClientListingLinkResponse {
  already_linked: boolean;
  client_listing_id?: number | null;
}

export interface ClientResponse {
  full_name: string;
  phone?: string | null;
  email?: string | null;
  customer_type?: string;
  goal_type?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  status?: "new" | "qualified" | "contacted" | "closed" | "archived";
  summary?: string | null;
  preference_json?: Record<string, unknown>;
  interaction_json?: Record<string, unknown>;
  id: number;
  tenant_id: number;
  broker_user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ClientSentListingResponse {
  id: number;
  tenant_id: number;
  client_id: number;
  listing_id: number;
  broker_user_id: number;
  message?: string | null;
  status: string;
  created_at: string;
}

export interface ClientTimelineResponse {
  events?: ClientInteractionEvent[];
  total: number;
}

export interface ClientUpdate {
  full_name?: string | null;
  phone?: string | null;
  email?: string | null;
  customer_type?: string | null;
  goal_type?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  status?: "new" | "qualified" | "contacted" | "closed" | "archived" | null;
  summary?: string | null;
  preference_json?: Record<string, unknown> | null;
  interaction_json?: Record<string, unknown> | null;
}