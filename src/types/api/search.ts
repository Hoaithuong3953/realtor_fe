export interface SearchFilters {
  status?: string;
  listing_type?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  location_json?: Record<string, string>;
  tag?: string;
  min_front?: number;
  max_front?: number;
  min_room?: number;
  max_room?: number;
  min_toilet?: number;
  max_toilet?: number;
  min_floor?: number;
  max_floor?: number;
  limit?: number;
  offset?: number;
  sort_by?: "created_at" | "updated_at" | "price" | "area";
  sort_order?: "asc" | "desc";
}

export interface SearchRequest extends SearchFilters {
  query_text?: string;
  client_id?: number | null;
  session_id?: number | null;
  intent?: string | null;
}

export interface SearchResultItem {
  id: number;
  tenant_id: number;
  title: string;
  price: number;
  area: number;
  listing_type: string;
  property_type: string;
  status: string;
  address_text?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SearchResult {
  items: SearchResultItem[];
  total: number;
  limit: number;
  offset: number;
  query_text: string;
  search_query_id?: number | null;
  applied_filters: Record<string, unknown>;
}

export interface SearchFeedbackRequest {
  search_query_id: number;
  listing_id?: number | null;
  feedback_type: "click" | "save" | "dismiss" | "not_relevant";
}

export interface SearchFeedbackResult {
  saved: number;
}

export interface SearchQueryHistoryItem {
  id: number;
  tenant_id: number;
  broker_user_id: number;
  query_text: string;
  parsed_filters: Record<string, unknown>;
  intent?: string | null;
  client_id?: number | null;
  session_id?: number | null;
  created_at: string;
}

export interface SearchQueryHistoryResult {
  items: SearchQueryHistoryItem[];
  total: number;
  limit: number;
  offset: number;
}
