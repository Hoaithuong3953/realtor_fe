import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { listingService, type GetListingsParams } from "@/services/listing.service"
import type { 
  ListingStatus, 
  ListingImportRequest 
} from "@/types/api"
import type { ListingFormValues } from "@/schemas/listing.schema"

export const LISTING_QUERY_KEYS = {
  all: ["listings"] as const,
  lists: () => [...LISTING_QUERY_KEYS.all, "list"] as const,
  list: (params: GetListingsParams) => [...LISTING_QUERY_KEYS.lists(), params] as const,
  details: () => [...LISTING_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...LISTING_QUERY_KEYS.details(), id] as const,
  importJobs: () => [...LISTING_QUERY_KEYS.all, "import-jobs"] as const,
  importJobDetail: (id: string | number) => [...LISTING_QUERY_KEYS.all, "import-job-detail", id] as const,
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
    meta: { errorMsg: t("messages.status_update_error") },
    onSuccess: (data, variables) => {
      // Optimistically update the detail view if cached
      queryClient.setQueryData(LISTING_QUERY_KEYS.detail(variables.id), data)
      void queryClient.invalidateQueries({queryKey: LISTING_QUERY_KEYS.lists()})
      toast.success(t("messages.status_update_success"))
    }
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
    meta: { errorMsg: t("messages.delete_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: LISTING_QUERY_KEYS.lists()})
      toast.success(t("messages.delete_success"))
    }
  })
}

/**
 * Hook to create a new listing
 */
export const useCreateListingMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ListingFormValues) => listingService.createListing(data),
    meta: { errorMsg: t("messages.create_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.create_success"))
    }
  })
}

/**
 * Hook to update an existing listing
 */
export const useUpdateListingMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: ListingFormValues }) =>
      listingService.updateListing(id, data),
    meta: { errorMsg: t("messages.update_error") },
    onSuccess: (data, variables) => {
      // Optimistically update the detail view if cached
      queryClient.setQueryData(LISTING_QUERY_KEYS.detail(variables.id), data)
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.update_success"))
    }
  })
}

/**
 * Hook to import listings from JSON
 */
export const useImportListingsJsonMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ListingImportRequest) => listingService.importListingsJson(data),
    meta: { errorMsg: t("messages.import_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.import_success"))
    }
  })
}

/**
 * Hook to import listings from Excel
 */
export const useImportListingsExcelMutation = () => {
  const { t } = useTranslation("listing")
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, params }: { file: File, params?: { replace_existing?: boolean; sheet_name?: string } }) => 
      listingService.importListingsExcel(file, params),
    meta: { errorMsg: t("messages.import_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LISTING_QUERY_KEYS.lists() })
      toast.success(t("messages.import_success"))
    }
  })
}

/**
 * Hook to get import jobs
 */
export const useImportJobsQuery = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: [...LISTING_QUERY_KEYS.importJobs(), params],
    queryFn: () => listingService.getImportJobs(params),
  })
}

/**
 * Hook to get import job detail
 */
export const useImportJobDetailQuery = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: LISTING_QUERY_KEYS.importJobDetail(id),
    queryFn: () => listingService.getImportJobDetail(id),
    enabled: !!id && enabled,
  })
}