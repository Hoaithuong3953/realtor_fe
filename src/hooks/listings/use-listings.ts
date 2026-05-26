import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { listingService, type GetListingsParams } from "@/services/listing.service"
import { handleApiError } from "@/utils/error-handler"
import { logger } from "@/utils/logger"
import type { ListingStatus, ListingCreate, ListingUpdate } from "@/types/api"

export const LISTING_QUERY_KEYS = {
  all: ["listings"] as const,
  lists: () => [...LISTING_QUERY_KEYS.all, "list"] as const,
  list: (params: GetListingsParams) => [...LISTING_QUERY_KEYS.lists(), params] as const,
  details: () => [...LISTING_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...LISTING_QUERY_KEYS.details(), id] as const,
}

/**
 * Hook to fetch a paginated/filtered list of properties
 */
export const useListingsQuery = (params: GetListingsParams) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.list(params),
    queryFn: () => listingService.getListings(params),
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (previousData) => previousData, // keep previous data while fetching new page
  })
}

/**
 * Hook to fetch a single property detail
 */
export const useListingDetailQuery = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.detail(id),
    queryFn: () => listingService.getListing(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to update a property's status
 */
export const useUpdateListingStatusMutation = () => {
  const {t} = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({id, status}: {id: string | number; status: ListingStatus}) =>
      listingService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      // Optimistically update the detail view if cached
      queryClient.setQueryData(LISTING_QUERY_KEYS.detail(variables.id), data)
      void queryClient.invalidateQueries({queryKey: LISTING_QUERY_KEYS.lists()})
      toast.success(t("messages.status_update_success"))
    },
    onError: (error) => {
      logger.error("Update listing status failed", handleApiError(error, false))
    },
    meta: {errorMessage: false}
  })
}

/**
 * Hook to delete a property
 */
export const useDeleteListingMutation = () => {
  const {t} = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: listingService.deleteListing,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: LISTING_QUERY_KEYS.lists()})
      toast.success(t("messages.delete_success"))
    },
    onError: (error) => {
      logger.error("Delete listing failed", handleApiError(error, false))
      toast.error(t("messages.delete_error"))
    },
    meta: {errorMessage: false}
  })
}

/**
 * Hook to create a new listing
 */
export const useCreateListingMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ListingCreate) => listingService.createListing(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.create_success"))
    },
    onError: (error) => {
      logger.error("Create listing failed", handleApiError(error, false))
      toast.error(t("messages.create_error"))
    },
    meta: { errorMessage: false }
  })
}

/**
 * Hook to update an existing listing
 */
export const useUpdateListingMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: ListingUpdate }) =>
      listingService.updateListing(id, data),
    onSuccess: (data, variables) => {
      // Optimistically update the detail view if cached
      queryClient.setQueryData(LISTING_QUERY_KEYS.detail(variables.id), data)
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.update_success"))
    },
    onError: (error) => {
      logger.error("Update listing failed", handleApiError(error, false))
      toast.error(t("messages.update_error"))
    },
    meta: { errorMessage: false }
  })
}