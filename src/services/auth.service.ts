import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import type {
    AuthUserOut,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
} from "@/types";

export const authService = {
    /** 
     * Service function for user login
     * [POST] /auth/login
     */
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            payload,
        )
        return response.data
    },

    /** 
     * Service function for user logout
     * [POST] /auth/logout
     */
    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
            refresh_token: refreshToken,
        })
    },

    /** 
     * Service function to get current user info
     * [GET] /auth/me 
     */
    getCurrentUser: async (): Promise<AuthUserOut> => {
        const response = await apiClient.get<AuthUserOut>(
            API_ENDPOINTS.AUTH.ME,
        )
        return response.data
    },

    /** 
     * Service function for user forgot password
     * [POST] /auth/forgot-password
     */
    forgotPassword: async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        const response = await apiClient.post<ForgotPasswordResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        payload,
        )
        return response.data
    },
}