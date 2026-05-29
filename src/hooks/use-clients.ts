import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { clientService } from "@/services/client.service"
import { useTranslation } from "react-i18next"
import type { ClientCreate, ClientUpdate, ClientInteractionCreate } from "@/types/api"

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

export const useClientQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.detail(id!),
    queryFn: () => clientService.getClient(id!),
    enabled: !!id && enabled,
  })
}

export const useCreateClientMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: (data: ClientCreate) => clientService.createClient(data),
    meta: { errorMsg: t("messages.create_error") },
    onSuccess: () => {
      toast.success(t("messages.create_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() })
    }
  })
}

export const useUpdateClientMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: (data: ClientUpdate) => clientService.updateClient(id, data),
    meta: { errorMsg: t("messages.update_error") },
    onSuccess: () => {
      toast.success(t("messages.update_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.detail(id) })
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() })
    }
  })
}

export const useDeleteClientMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: (id: string | number) => clientService.deleteClient(id),
    meta: { errorMsg: t("messages.delete_error") },
    onSuccess: () => {
      toast.success(t("messages.delete_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.lists() })
    }
  })
}

export const useClientTimelineQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.timeline(id!),
    queryFn: () => clientService.getClientTimeline(id!),
    enabled: !!id && enabled,
  })
}

export const useCreateInteractionMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: (data: ClientInteractionCreate) => clientService.createInteraction(id, data),
    meta: { errorMsg: t("messages.interaction_error") },
    onSuccess: () => {
      toast.success(t("messages.interaction_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.timeline(id) })
    }
  })
}

export const useClientListingsQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.listing(id!),
    queryFn: () => clientService.getClientListings(id!),
    enabled: !!id && enabled,
  })
}

export const useCheckListingLinkQuery = (id: string | number | undefined, listingId: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: [...CLIENT_KEYS.listing(id!), "check", listingId],
    queryFn: () => clientService.checkListingLink(id!, listingId!),
    enabled: !!id && !!listingId && enabled,
  })
}

export const useLinkListingMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: ({ listingId, message }: { listingId: string | number; message?: string }) => 
      clientService.linkListing(id, listingId, message),
    meta: { errorMsg: t("messages.link_error") },
    onSuccess: () => {
      toast.success(t("messages.link_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.listing(id) })
    }
  })
}

export const useUnlinkListingMutation = (id: string | number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("client")

  return useMutation({
    mutationFn: (listingId: string | number) => clientService.unlinkListing(id, listingId),
    meta: { errorMsg: t("messages.unlink_error") },
    onSuccess: () => {
      toast.success(t("messages.unlink_success"))
      void queryClient.invalidateQueries({ queryKey: CLIENT_KEYS.listing(id) })
    }
  })
}

export const useClientContextQuery = (id: string | number | undefined, enabled = true) => {
  return useQuery({
    queryKey: CLIENT_KEYS.context(id!),
    queryFn: () => clientService.getClientContext(id!),
    enabled: !!id && enabled,
  })
}
