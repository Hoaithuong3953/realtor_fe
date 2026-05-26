import { API_ENDPOINTS } from "@/constants/api"
import { apiClient } from "@/lib/api-client"
import type { 
  ClientListResponse,
  ClientResponse,
  ClientCreate,
  ClientUpdate,
  ClientTimelineResponse,
  ClientInteractionCreate,
  ClientInteractionEvent,
  ClientSentListingResponse,
  ClientListingLinkResponse,
  ClientContextResponse
} from "@/types/api"

export const clientService = {
  getClients: async (params?: Record<string, unknown>): Promise<ClientListResponse> => {
    const response = await apiClient.get<ClientListResponse>(API_ENDPOINTS.CLIENTS.ROOT, { params })
    return response.data
  },

  getClient: async (id: string | number): Promise<ClientResponse> => {
    const response = await apiClient.get<ClientResponse>(API_ENDPOINTS.CLIENTS.DETAIL(id))
    return response.data
  },

  createClient: async (data: ClientCreate): Promise<ClientResponse> => {
    const response = await apiClient.post<ClientResponse>(API_ENDPOINTS.CLIENTS.ROOT, data)
    return response.data
  },

  updateClient: async (id: string | number, data: ClientUpdate): Promise<ClientResponse> => {
    const response = await apiClient.patch<ClientResponse>(API_ENDPOINTS.CLIENTS.DETAIL(id), data)
    return response.data
  },

  deleteClient: async (id: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.DETAIL(id))
  },

  getClientTimeline: async (id: string | number): Promise<ClientTimelineResponse> => {
    const response = await apiClient.get<ClientTimelineResponse>(API_ENDPOINTS.CLIENTS.TIMELINE(id))
    return response.data
  },

  createInteraction: async (id: string | number, data: ClientInteractionCreate): Promise<ClientInteractionEvent> => {
    const response = await apiClient.post<ClientInteractionEvent>(API_ENDPOINTS.CLIENTS.INTERACTIONS(id), data)
    return response.data
  },

  getClientListings: async (id: string | number): Promise<ClientSentListingResponse[]> => {
    const response = await apiClient.get<ClientSentListingResponse[]>(API_ENDPOINTS.CLIENTS.LISTINGS(id))
    return response.data
  },

  checkListingLink: async (id: string | number, listingId: string | number): Promise<ClientListingLinkResponse> => {
    const response = await apiClient.get<ClientListingLinkResponse>(API_ENDPOINTS.CLIENTS.LINK_LISTING(id, listingId))
    return response.data
  },

  linkListing: async (id: string | number, listingId: string | number, message?: string): Promise<ClientSentListingResponse> => {
    const response = await apiClient.post<ClientSentListingResponse>(API_ENDPOINTS.CLIENTS.LINK_LISTING(id, listingId), { message })
    return response.data
  },

  unlinkListing: async (id: string | number, listingId: string | number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CLIENTS.LINK_LISTING(id, listingId))
  },

  getClientContext: async (id: string | number): Promise<ClientContextResponse> => {
    const response = await apiClient.get<ClientContextResponse>(API_ENDPOINTS.CLIENTS.CONTEXT(id))
    return response.data
  }
}
