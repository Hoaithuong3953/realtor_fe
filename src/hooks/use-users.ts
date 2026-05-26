import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { userService } from "@/services/user.service"
import type { UserCreate, UserUpdate } from "@/types/api/user"

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
    meta: {
      customErrorMsg: t("messages.create_error")
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
    },
  })
}

export const useUpdateUserMutation = (id: number) => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (payload: UserUpdate) =>
      userService.updateUser(id, payload),
    meta: {
      customErrorMsg: t("messages.update_error")
    },
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
      queryClient.setQueryData(
        userKeys.detail(id),
        updatedUser,
      )
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  const { t } = useTranslation("user")
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    meta: {
      customErrorMsg: t("messages.delete_error")
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      })
    },
  })
}