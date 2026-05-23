export const LISTING_TYPES = ["sale", "rent"] as const;
export const PROPERTY_TYPES = ["apartment", "house", "villa", "land"] as const;
export const LISTING_STATUSES = ["active", "draft", "inactive"] as const;
export const IMPORT_LISTING_STATUSES = ["active", "draft", "inactive", "sold", "rented"] as const;

export interface ImportJobResponse {
  id: number;
  tenant_id: number;
  created_by?: number | null;
  source_type: string;
  file_url?: string | null;
  status: string;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  result_json?: Record<string, unknown>;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingCreate {
  title: string;
  description?: string | null;
  price?: number;
  area?: number;
  listing_type: ListingType;
  property_type: PropertyType;
  status?: ListingStatus;
  address_text?: string | null;
  location_json?: Record<string, unknown>;
  geo?: Record<string, unknown>;
  tags?: string[];
  attributes?: Record<string, unknown>;
  media?: Record<string, unknown>[];
}

export interface ListingImportItem {
  source_ref?: string | number | null;
  title: string;
  description?: string | null;
  price?: number;
  area?: number;
  listing_type: ListingType;
  property_type: PropertyType;
  status?: ImportListingStatus;
  address_text?: string | null;
  location_json?: Record<string, unknown>;
  geo?: Record<string, unknown>;
  tags?: string[];
  attributes?: Record<string, unknown>;
  media?: Record<string, unknown>[];
  owner_user_id?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
}

export interface ListingImportRequest {
  source_type?: string;
  replace_existing?: boolean;
  items?: ListingImportItem[];
  raw_items?: Record<string, unknown>[];
}

export interface ListingImportResponse {
  job: ImportJobResponse;
  total_rows: number;
  success_rows: number;
  failed_rows: number;
  skipped_rows: number;
  results: ListingImportRowResult[];
}

export interface ListingImportRowResult {
  index: number;
  source_ref?: string | number | null;
  status: "created" | "updated" | "skipped" | "failed";
  listing_id?: number | null;
  message?: string | null;
}

export interface ListingListResponse {
  items: ListingResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListingResponse {
  title: string;
  description?: string | null;
  price?: number;
  area?: number;
  listing_type: ListingType;
  property_type: PropertyType;
  status?: ListingStatus;
  address_text?: string | null;
  id: number;
  tenant_id: number;
  created_by?: number | null;
  updated_by?: number | null;
  owner_user_id?: number | null;
  location_json?: Record<string, unknown>;
  geo?: Record<string, unknown>;
  tags?: string[];
  attributes?: Record<string, unknown>;
  media?: Record<string, unknown>[];
  source_type: string;
  source_ref?: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ListingStatusUpdate {
  status: ListingStatus;
}

export interface ListingUpdate {
  title?: string | null;
  description?: string | null;
  price?: number | null;
  area?: number | null;
  listing_type?: ListingType | null;
  property_type?: PropertyType | null;
  status?: ListingStatus | null;
  address_text?: string | null;
  location_json?: Record<string, unknown> | null;
  geo?: Record<string, unknown> | null;
  tags?: string[] | null;
  attributes?: Record<string, unknown> | null;
  media?: Record<string, unknown>[] | null;
}

export type ListingType = typeof LISTING_TYPES[number];
export type PropertyType = typeof PROPERTY_TYPES[number];
export type ListingStatus = typeof LISTING_STATUSES[number];
export type ImportListingStatus = typeof IMPORT_LISTING_STATUSES[number];