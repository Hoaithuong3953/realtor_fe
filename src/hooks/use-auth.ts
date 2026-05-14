import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { paths } from "@/routes/paths";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { handleApiError } from "@/utils/error-handler";
import { logger } from "@/utils/logger";

/** 
 * Hook for handling login mutation
*/
export const useLoginMutation = () => {
    const {t} = useTranslation("auth")
    const navigate = useNavigate()
    const setLoginSuccess = useAuthStore((state) => state.setLoginSuccess)

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            const {user, tokens} = data
            setLoginSuccess(user, tokens.access_token, tokens.refresh_token)
            logger.info("User logged in successfully", { email: user.email, userId: user.id });
            toast.success(t("login.success_msg"))
            void navigate(paths.home)
        },
        onError: (error) => {
            logger.error("Login failed", handleApiError(error))
            toast.error(t("login.error_msg"))
        },
    })
}

/**
 * Hook for handling logout mutation
 */
export const useLogoutMutation = () => {
    const {t} = useTranslation("auth")
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    const refreshToken = useAuthStore((state) => state.refreshToken)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                await authService.logout(refreshToken)
            }
        },
        onSuccess: () => {
            queryClient.clear()
            logout()
            toast.success(t("logout.success_msg"))
            void navigate(paths.auth.login)
        },
        onError: (error) => {
            queryClient.clear()
            logout()
            logger.error("Logout failed, but user session cleared", handleApiError(error))
            void navigate(paths.auth.login)
        }
    })
}

/** 
 * Hook for fetching current user info
*/
export const useCurrentUserQuery = (enable = true) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

    return useQuery({
        queryKey: ['auth', 'currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: enable && isAuthenticated,
        staleTime: 1000 * 60 * 5,
    })
}