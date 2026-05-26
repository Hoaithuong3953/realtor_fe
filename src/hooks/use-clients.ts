import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientService } from "@/services/client.service"
import { useTranslation } from "react-i18next"

export const CLIENT_KEYS = {
  all: ["clients"] as const,
  lists: () => [...CLIENT_KEYS.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...CLIENT_KEYS.lists(), params] as const,
  details: () => [...CLIENT_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...CLIENT_KEYS.details(), id] as const,
  timelines: () => [...CLIENT_KEYS.all, "timeline"] as const,
  timeline: (id: string | number) => [...CLIENT_KEYS.timelines(), id] as const,
  listings: () => [...CLIENT_KEYS.all, "listings"] as const,
  listing: (id: string | number) => [...CLIENT_KEYS.listings(), id] as const,
  contexts: () => [...CLIENT_KEYS.all, "context"] as const,
  context: (id: string | number) => [...CLIENT_KEYS.contexts(), id] as const,
}

export const useClientsQuery = (params: Record<string, unknown> = {}, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.list(params),
    queryFn: () => clientService.getClients(params),
    enabled
  })
}

export const useClientListingsQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.listing(id!),
    queryFn: () => clientService.getClientListings(id!),
    enabled: !!id && enabled,
  })
}

export const useLinkListingMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: ({ listingId, message }: { listingId: string | number; message?: string }) => 
      clientService.linkListing(id, listingId, message),
    onSuccess: () => {
      toast.success(t("messages.link_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.listing(id) })
    },
    onError: (error: Error) => {
      toast.error(error.message || t("messages.link_error"))
    },
  })
}