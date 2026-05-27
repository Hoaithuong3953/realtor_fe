import { useQuery, useMutation } from "@tanstack/react-query"
import { searchService } from "@/services/search.service"
import type { SearchRequest, SearchFeedbackRequest } from "@/types/api/search"

export const SEARCH_KEYS = {
  all: ["search"] as const,
  results: (params: Record<string, unknown>) => [...SEARCH_KEYS.all, "results", params] as const,
}

export const useSearchListingsQuery = (payload: SearchRequest | undefined, enabled = false) => {
  return useQuery({
    queryKey: SEARCH_KEYS.results(payload as Record<string, unknown> || {}),
    queryFn: () => searchService.searchListings(payload!),
    enabled: !!payload && enabled,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateSearchFeedbackMutation = () => {
  return useMutation({
    mutationFn: (data: SearchFeedbackRequest) => searchService.createFeedback(data),
    meta: {
      errorMessage: false
    }
  })
}
