import { apiClient } from "@/lib/api-client"
import { API_ENDPOINTS, API_CONFIG } from "@/constants/api"
import type {
  UserListResponse,
  UserPublic,
  UserCreate,
  UserUpdate,
  UserImportResponse
} from "@/types/api/user"

export const userService = {
  /**
   * Fetch list of users with pagination
   * [GET] /users
   */
  getUsers: async (params: { limit?: number; offset?: number } = {}): Promise<UserListResponse> => {
    const { data } = await apiClient.get<UserListResponse>(API_ENDPOINTS.USERS.ROOT, { params })
    return data
  },
  
  /**
   * Create a new user
   * [POST] /users
   */
  createUser: async (payload: UserCreate): Promise<UserPublic> => {
    const { data } = await apiClient.post<UserPublic>(API_ENDPOINTS.USERS.ROOT, payload)
    return data
  },
  
  /**
   * Update an existing user
   * [PATCH] /users/:id
   */
  updateUser: async (id: number, payload: UserUpdate): Promise<UserPublic> => {
    const { data } = await apiClient.patch<UserPublic>(API_ENDPOINTS.USERS.DETAIL(id), payload)
    return data
  },
  
  /**
   * Delete a user
   * [DELETE] /users/:id
   */
  deleteUser: async (id: number): Promise<UserPublic> => {
    const { data } = await apiClient.delete<UserPublic>(API_ENDPOINTS.USERS.DETAIL(id))
    return data
  },

  /**
   * Get current user profile
   * [GET] /users/me
   */
  getProfile: async (): Promise<UserPublic> => {
    const { data } = await apiClient.get<UserPublic>(API_ENDPOINTS.USERS.ME)
    return data
  },

  /**
   * Update current user profile
   * [PATCH] /users/me
   */
  updateProfile: async (payload: UserUpdate): Promise<UserPublic> => {
    const { data } = await apiClient.patch<UserPublic>(API_ENDPOINTS.USERS.ME, payload)
    return data
  },

  /**
   * Import users from Excel file
   * [POST] /users/import-excel
   */
  importUsersExcel: async (file: File): Promise<UserImportResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    const { data } = await apiClient.post<UserImportResponse>(
      API_ENDPOINTS.USERS.IMPORT_EXCEL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: API_CONFIG.AI_TIMEOUT,
      }
    )
    return data
  },
}
