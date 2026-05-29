import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { userService } from "@/services/user.service"
import type { UserCreate, UserUpdate } from "@/types/api/user"
import { useAuthStore } from "@/store/auth.store"
import { toast } from "sonner"

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

export const useUsersQuery = (params: { limit?: number; offset?: number } = {}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
  })
}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (payload: UserCreate) => userService.createUser(payload),
    meta: { errorMsg: t("messages.create_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
    }
  })
}

export const useUpdateUserMutation = (id: number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (payload: UserUpdate) =>
      userService.updateUser(id, payload),
    meta: { errorMsg: t("messages.update_error") },
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      queryClient.setQueryData(
        userKeys.detail(id),
        updatedUser,
      )
    }
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    meta: { errorMsg: t("messages.delete_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
    }
  })
}

export const useProfileQuery = () => {
  return useQuery({
    queryKey: [...userKeys.all, "profile"],
    queryFn: () => userService.getProfile(),
  })
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  const currentUser = useAuthStore(state => state.user)

  return useMutation({
    mutationFn: (payload: UserUpdate) => {
      if (!currentUser?.id) throw new Error("User ID not found")
      return userService.updateUser(currentUser.id, payload)
    },
    meta: { errorMsg: t("messages.update_error") },
    onSuccess: (_, variables) => {
      useAuthStore.getState().updateUser({
        full_name: variables.full_name ?? undefined,
      })
      void queryClient.invalidateQueries({
        queryKey: ['auth', 'currentUser'],
      })
      toast.success(t("messages.update_success"))
    }
  })
}

export const useImportUsersExcelMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (file: File) => userService.importUsersExcel(file),
    meta: { errorMsg: t("messages.import_error") },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      toast.success(t("messages.import_success"))
    }
  })
}