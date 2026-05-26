import { API_ENDPOINTS } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type { 
  ListingResponse, 
  ListingListResponse,
  ListingStatusUpdate,
  ListingStatus,
  ListingCreate,
  ListingUpdate
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
}
