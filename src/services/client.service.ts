import { API_ENDPOINTS } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type { 
  ClientListResponse,
  ClientSentListingResponse,
} from "@/types/api"

export const clientService = {
  getClients: async (params?: Record<string, unknown>): Promise<ClientListResponse> => {
    const response = await apiClient.get<ClientListResponse>(API_ENDPOINTS.CLIENTS.ROOT, { params })
    return response.data
  },


  getClientListings: async (id: string | number): Promise<ClientSentListingResponse[]> => {
    const response = await apiClient.get<ClientSentListingResponse[]>(API_ENDPOINTS.CLIENTS.LISTINGS(id))
    return response.data
  },

  linkListing: async (id: string | number, listingId: string | number, message?: string): Promise<ClientSentListingResponse> => {
    const response = await apiClient.post<ClientSentListingResponse>(API_ENDPOINTS.CLIENTS.LINK_LISTING(id, listingId), { message })
    return response.data
  },
}
