import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type { 
  ListingResponse, 
  ListingListResponse,
  ListingStatusUpdate,
  ListingStatus,
  ListingImportRequest,
  ListingImportResponse,
  ImportJobResponse
} from "@/types/api"
import type { ListingFormValues } from "@/schemas/listing.schema"

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
   * [POST] /listings (supports multipart file uploads and web URLs)
   */
  createListing: async (data: ListingFormValues): Promise<ListingResponse> => {
    const files: File[] = []
    const mediaUrls: Record<string, unknown>[] = []

    if (data.media && Array.isArray(data.media)) {
      data.media.forEach((rawItem) => {
        const item = rawItem as { file?: File; url?: string }
        if (item.file && item.file instanceof File) {
          files.push(item.file)
        } else if (item.url && typeof item.url === "string" && !item.url.startsWith("blob:")) {
          mediaUrls.push({ url: item.url, image: item.url })
        }
      })
    }

    let createdListing: ListingResponse

    if (files.length > 0) {
      const formData = new FormData()
      
      formData.append("title", data.title)
      formData.append("listing_type", data.listing_type)
      formData.append("property_type", data.property_type)
      if (data.description !== undefined && data.description !== null) {
        formData.append("description", data.description)
      }
      formData.append("price", String(data.price ?? 0))
      formData.append("area", String(data.area ?? 0))
      formData.append("status", data.status || "draft")
      formData.append("address_text", data.address_text)

      formData.append("location_json", JSON.stringify(data.location_json || {}))
      formData.append("geo", JSON.stringify(data.geo || {}))
      formData.append("tags", JSON.stringify(data.tags || []))
      formData.append("attributes", JSON.stringify(data.attributes || {}))

      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await apiClient.post<ListingResponse>(
        API_ENDPOINTS.LISTINGS.ROOT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      createdListing = response.data

      // If there were also web URLs, patch the created listing to combine them
      if (mediaUrls.length > 0) {
        const combinedMedia = [...mediaUrls, ...(createdListing.media || [])]
        const patchResponse = await apiClient.patch<ListingResponse>(
          API_ENDPOINTS.LISTINGS.DETAIL(createdListing.id),
          { media: combinedMedia }
        )
        createdListing = patchResponse.data
      }
    } else {
      const jsonPayload = {
        ...data,
        media: mediaUrls,
      }
      const response = await apiClient.post<ListingResponse>(
        API_ENDPOINTS.LISTINGS.ROOT,
        jsonPayload
      )
      createdListing = response.data
    }

    return createdListing
  },

  /**
   * Update an existing listing
   * [PATCH] /listings/{id} (supports adding new files via subsequent uploadimage PUT call)
   */
  updateListing: async (id: number | string, data: ListingFormValues): Promise<ListingResponse> => {
    const files: File[] = []
    const retainedMedia: Record<string, unknown>[] = []

    if (data.media && Array.isArray(data.media)) {
      data.media.forEach((rawItem) => {
        const item = rawItem as { file?: File; url?: string }
        if (item.file && item.file instanceof File) {
          files.push(item.file)
        } else if (item.url && typeof item.url === "string" && !item.url.startsWith("blob:")) {
          retainedMedia.push({ url: item.url, image: item.url })
        }
      })
    }

    const patchPayload = {
      ...data,
      media: retainedMedia,
    }
    
    const patchResponse = await apiClient.patch<ListingResponse>(
      API_ENDPOINTS.LISTINGS.DETAIL(id), 
      patchPayload
    )
    let updatedListing = patchResponse.data

    if (files.length > 0) {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const uploadResponse = await apiClient.put<ListingResponse>(
        API_ENDPOINTS.LISTINGS.UPLOAD_IMAGE(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      updatedListing = uploadResponse.data
    }

    return updatedListing
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
