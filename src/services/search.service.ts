import { API_ENDPOINTS } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type {
  SearchFeedbackRequest,
  SearchFeedbackResult,
  SearchRequest,
  SearchResult,
} from "@/types/api/search"

export const searchService = {
  /**
   * Search listings with payload
   * [POST] /search
   */
  searchListings: async (payload: SearchRequest): Promise<SearchResult> => {
    const response = await apiClient.post<SearchResult>(
      API_ENDPOINTS.SEARCH.ROOT,
      payload
    )
    return response.data
  },

  /**
   * Create search feedback
   * [POST] /search/feedback
   */
  createFeedback: async (payload: SearchFeedbackRequest): Promise<SearchFeedbackResult> => {
    const response = await apiClient.post<SearchFeedbackResult>(
      API_ENDPOINTS.SEARCH.FEEDBACK,
      payload
    )
    return response.data
  },
}
