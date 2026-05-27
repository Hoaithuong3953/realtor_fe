import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { API_ENDPOINTS } from "@/constants/api"
import { STORAGE_KEYS } from "@/constants/auth"
import { apiClient } from "@/lib/api-client"
import { paths } from "@/routes/paths"
import { router } from "@/routes/router"
import { forceLogout } from "@/services/auth-interceptor"
import { useAuthStore } from "@/store/auth.store"
import { type AuthEventPayload, authEvents } from "@/utils/auth-events"
import { handleApiError } from "@/utils/error-handler"
import { logger } from "@/utils/logger"

/**
 * Custom hook to manage all global application bootstrapping, credential validation on startup,
 * session expiration event subscriptions, and cross-tab session state synchronization.
 */
export function useAuthBootstrap() {
  const { t } = useTranslation()

  useEffect(() => {
    // 1. Listen for global session expiration events
    const onSessionExpired = (payload: AuthEventPayload) => {
      const expiredMessage =
        payload.reason === "revoked" ? t("auth:errors.session_revoked") : t("auth:errors.session_expired")

      toast.error(expiredMessage)
      void router.navigate(paths.auth.login)
    }

    authEvents.on("SESSION_EXPIRED", onSessionExpired)

    // 2. Cross-tab synchronization: Listen to parsed localStorage mutations to sync logout states safely
    const syncSessionAcrossTabs = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.AUTH_STORE && event.newValue) {
        try {
          const parsed: unknown = JSON.parse(event.newValue)
          const persistedState =
            typeof parsed === "object" && parsed !== null && "state" in parsed
              ? (parsed as { state?: { isAuthenticated?: boolean } }).state
              : undefined
          const targetIsAuthenticated = persistedState?.isAuthenticated

          // If the storage mutation indicates a logout has occurred in another tab
          if (targetIsAuthenticated === false) {
            const localIsAuthenticated = useAuthStore.getState().isAuthenticated

            // Only perform local logout state modification if our tab is currently authenticated
            if (localIsAuthenticated) {
              logger.info("Session logout detected in another tab. Syncing local credentials...")
              useAuthStore.getState().logout()
            }

            // Always trigger the navigation redirect and toast notice once for consistency
            authEvents.emit("SESSION_EXPIRED", { reason: "manual_logout" })
          }
        } catch (error) {
          logger.error("Failed to parse synchronized cross-tab state changes.", error)
        }
      }
    }

    window.addEventListener("storage", syncSessionAcrossTabs)

    // 3. Auth Bootstrap: Verify credentials viability on initial application load, tolerating transient network errors
    const validateAuthBootstrap = async () => {
      const { accessToken } = useAuthStore.getState()
      if (!accessToken) {
        return
      }

      try {
        logger.info("Verifying session credentials on startup...")
        await apiClient.get(API_ENDPOINTS.AUTH.ME)
        logger.info("Session verified successfully.")
      } catch (error: unknown) {
        const { statusCode } = handleApiError(error)

        // Fault tolerance: Only trigger forceLogout on genuine, definitive authentication/authorization rejections (401, 403)
        if (statusCode === 401 || statusCode === 403) {
          logger.warn("Initial session verification rejected by server. Invalidating credentials.", error)
          forceLogout("expired")
        } else {
          // Keep the session active during transient network drops or server restarts (5xx / offline)
          logger.warn("Transient network/server failure during startup check. Preserving local session state.", error)
        }
      }
    }

    void validateAuthBootstrap()

    // Unsubscribe from global listeners when component unmounts
    return () => {
      authEvents.off("SESSION_EXPIRED", onSessionExpired)
      window.removeEventListener("storage", syncSessionAcrossTabs)
    }
  }, [t])
}
