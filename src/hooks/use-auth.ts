import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { paths } from "@/routes/paths";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
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
        meta: { 
            errorMsg: t("login.error_msg"),
            isLoginRequest: true
        },
        onSuccess: (data) => {
            const {user, tokens} = data
            setLoginSuccess(user, tokens.access_token)
            logger.info("User logged in successfully", { email: user.email, userId: user.id });
            toast.success(t("login.success_msg"))
            void navigate(paths.home)
        }
    })
}

/**
 * Hook for handling logout mutation
 */
export const useLogoutMutation = () => {
    const {t} = useTranslation("auth")
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            await authService.logout()
        },
        meta: { errorMsg: t("logout.error_msg") },
        onSuccess: () => {
            queryClient.clear()
            logout()
            toast.success(t("logout.success_msg"))
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

/**
 * Hook for requesting password reset link
 */
export const useForgotPasswordMutation = () => {
  const { t } = useTranslation("auth");

  return useMutation({
    mutationFn: authService.forgotPassword,
    meta: { errorMsg: t("forgot_password.error_msg") },
    onSuccess: () => {
      toast.success(t("forgot_password.success_msg"));
    }
  });
};

/**
 * Hook for resetting password
 */
export const useResetPasswordMutation = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.resetPassword,
    meta: { errorMsg: t("reset_password.error_msg") },
    onSuccess: () => {
      toast.success(t("reset_password.success_msg"));
      void navigate(paths.auth.login);
    }
  });
};

/**
 * Hook for changing password
 */
export const useChangePasswordMutation = () => {
  const { t } = useTranslation("auth")
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.changePassword,
    meta: { errorMsg: t("change_password.error_msg") },
    onSuccess: () => {
      toast.success(t("change_password.success_msg"))
      logout()
      void navigate(paths.auth.login)
    }
  })
}