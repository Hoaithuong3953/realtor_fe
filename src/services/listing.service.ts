import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type { 
  ListingResponse, 
  ListingListResponse,
  ListingStatusUpdate,
  ListingStatus,
  ListingCreate,
  ListingUpdate,
  ListingImportRequest,
  ListingImportResponse,
  ImportJobResponse
} from "@/types/api"

export type GetListingsParams = {
  keyword?: string
  status?: string
  min_price?: number
  max_price?: number
  min_area?: number
  max_area?: number
  property_type?: string
  listing_type?: string
  limit?: number
  offset?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export const listingService = {
  /**
   * Fetch list of listings with optional filters
   * [GET] /listings
   */
  getListings: async (params?: GetListingsParams): Promise<ListingListResponse> => {
    const response = await apiClient.get<ListingListResponse>(API_ENDPOINTS.LISTINGS.ROOT, {
      params,
    })
    return response.data
  },

  /**
   * Fetch a single listing by ID
   * [GET] /listings/{id}
   */
  getListing: async (id: number | string): Promise<ListingResponse> => {
    const response = await apiClient.get<ListingResponse>(API_ENDPOINTS.LISTINGS.DETAIL(id))
    return response.data
  },

  /**
   * Delete a listing
   * [DELETE] /listings/{id}
   */
  deleteListing: async (id: number | string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.LISTINGS.DETAIL(id))
  },

  /**
   * Update listing status
   * [PATCH] /listings/{id}/status
   */
  updateStatus: async (id: number | string, status: ListingStatus): Promise<ListingResponse> => {
    const payload: ListingStatusUpdate = { status }
    const response = await apiClient.patch<ListingResponse>(API_ENDPOINTS.LISTINGS.STATUS(id), payload)
    return response.data
  },

  /**
   * Create a new listing
   * [POST] /listings
   */
  createListing: async (data: ListingCreate): Promise<ListingResponse> => {
    const response = await apiClient.post<ListingResponse>(API_ENDPOINTS.LISTINGS.ROOT, data)
    return response.data
  },

  /**
   * Update an existing listing
   * [PATCH] /listings/{id}
   */
  updateListing: async (id: number | string, data: ListingUpdate): Promise<ListingResponse> => {
    const response = await apiClient.patch<ListingResponse>(API_ENDPOINTS.LISTINGS.DETAIL(id), data)
    return response.data
  },

  /**
   * Import listings from JSON
   * [POST] /listings/import-json
   */
  importListingsJson: async (data: ListingImportRequest): Promise<ListingImportResponse> => {
    const response = await apiClient.post<ListingImportResponse>(API_ENDPOINTS.LISTINGS.IMPORT_JSON, data)
    return response.data
  },

  /**
   * Import listings from Excel file
   * [POST] /listings/import-excel
   */
  importListingsExcel: async (file: File, params?: { replace_existing?: boolean; sheet_name?: string }): Promise<ListingImportResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    
    const response = await apiClient.post<ListingImportResponse>(
      API_ENDPOINTS.LISTINGS.IMPORT_EXCEL,
      formData,
      {
        params,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: API_CONFIG.AI_TIMEOUT,
      }
    )
    return response.data
  },

  /**
   * Get list of import jobs
   * [GET] /listings/import-jobs
   */
  getImportJobs: async (params?: { limit?: number; offset?: number }): Promise<ImportJobResponse[]> => {
    const response = await apiClient.get<ImportJobResponse[]>(API_ENDPOINTS.LISTINGS.IMPORT_JOBS, { params })
    return response.data
  },

  /**
   * Get import job detail
   * [GET] /listings/import-jobs/{id}
   */
  getImportJobDetail: async (id: string | number): Promise<ImportJobResponse> => {
    const response = await apiClient.get<ImportJobResponse>(API_ENDPOINTS.LISTINGS.IMPORT_JOB_DETAIL(id))
    return response.data
  },
}
