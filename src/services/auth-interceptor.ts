import axios, { type InternalAxiosRequestConfig, isAxiosError } from "axios";

import { API_ENDPOINTS } from "@/constants/api";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth.store";
import type { LoginResponse } from "@/types";
import { authEvents } from "@/utils/auth-events";
import { handleApiError } from "@/utils/error-handler";
import { logger } from "@/utils/logger";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];
let isInterceptorsRegistered = false;
let refreshAbortController: AbortController | null = null;

/**
 * Resolves or rejects the queued requests once the token refresh succeeds or fails
 */
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

/**
 * Idempotent helper to clear local credentials and trigger session expiration events
 */
export const forceLogout = (reason: "expired" | "revoked" | "manual_logout" = "expired") => {
  const { isAuthenticated, logout } = useAuthStore.getState();
  
  // Guard clause to prevent duplicate event emissions or redirect loops on simultaneous 401s
  if (!isAuthenticated) {return;}

  // Abort any ongoing background token refresh request to save server bandwidth
  if (refreshAbortController) {
    refreshAbortController.abort();
    refreshAbortController = null;
  }

  logout();
  authEvents.emit("SESSION_EXPIRED", { reason });
};

/**
 * Main registration function. Guards against duplicate registrations from HMR or dynamic imports.
 */
export const setupAuthInterceptors = () => {
  if (isInterceptorsRegistered) {return;}

  // REQUEST INTERCEPTOR: Automatically attach the current Access Token to outgoing requests
  apiClient.interceptors.request.use(
    (config) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: unknown) => {
      logger.error("Request Interceptor Error", error);
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    }
  );

  // RESPONSE INTERCEPTOR: Intercept 401 errors, execute silent refresh, queue calls, and normalize error structures
  apiClient.interceptors.response.use(
    (response) => {
      if (import.meta.env.DEV) {
        logger.debug(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      }
      return response;
    },
    async (error: unknown) => {
      if (!isAxiosError(error)) {
        logger.error("Non-Axios Error occurred", error);
        return Promise.reject(error instanceof Error ? error : new Error(String(error)));
      }

      const originalRequest = error.config as CustomAxiosRequestConfig;
      const status = error.response?.status;

      // Exit early if the error is due to an aborted request (e.g., manually cancelled during logout)
      if (axios.isCancel(error)) {
        logger.warn("API Request was cancelled.");
        return Promise.reject(error);
      }

      // Prevent infinite loop recursion if the refresh token API call itself fails
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        logger.error("Token Refresh Failed", error.response?.data);
        const normalizedError = handleApiError(error);
        return Promise.reject(normalizedError);
      }

      // Handle 401 Unauthorized exceptions to initiate the background silent refresh flow
      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err: unknown) => Promise.reject(err instanceof Error ? err : new Error(String(err))));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = useAuthStore.getState().refreshToken;
        const currentUser = useAuthStore.getState().user;
        const isAuthenticated = useAuthStore.getState().isAuthenticated;

        // Defensive guard: Ensure valid local session states before hitting the endpoint
        if (!refreshToken || !currentUser || !isAuthenticated) {
          logger.warn("Authentication credentials or user profile missing. Skipping token refresh.");
          forceLogout("expired");
          const normalizedError = handleApiError(error);
          return Promise.reject(normalizedError);
        }

        // Initialize AbortController to allow request cancellation on manual logouts or timeouts
        refreshAbortController = new AbortController();

        // Guard against infinite hanging refresh requests via an active 10s watchdog timeout
        const refreshTimeoutId = setTimeout(() => {
          if (refreshAbortController) {
            logger.error("Token refresh request timed out after 10 seconds. Aborting.");
            refreshAbortController.abort();
          }
        }, 10000);

        try {
          logger.info("Access token expired, attempting background token refresh...");
          
          // Execute background call using raw axios to bypass client interceptors.
          // FastAPI Backend expects empty body and refresh token passed via "X-Refresh-Token" Header.
          const response = await axios.post<LoginResponse>(
            `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`,
            {},
            {
              headers: {
                "X-Refresh-Token": refreshToken,
              },
              signal: refreshAbortController.signal,
            }
          );

          // Clear watchdog timer once response is successfully received
          clearTimeout(refreshTimeoutId);

          // Extract standard access and refresh credentials from nested tokens object
          const { access_token: newAccessToken, refresh_token: newRefreshToken } = response.data.tokens;

          logger.info("Token refresh successful, updating credentials.");

          // Save new credentials back to Zustand store
          useAuthStore.getState().setLoginSuccess(
            currentUser,
            newAccessToken,
            newRefreshToken
          );

          // Update default Authorization headers for future queries
          apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Clear watchdog timer on request error or cancellation
          clearTimeout(refreshTimeoutId);

          // If the request was aborted, let the cancellation catch-block handle it
          if (axios.isCancel(refreshError)) {
            logger.warn("Background silent refresh aborted.");
            return Promise.reject(refreshError);
          }

          logger.error("Failed to refresh token", refreshError);
          processQueue(refreshError, null);
          forceLogout("revoked");
          const normalizedError = handleApiError(refreshError);
          return Promise.reject(normalizedError);
        } finally {
          isRefreshing = false;
          refreshAbortController = null;
        }
      }

      // Log generic failures
      logger.error(
        `API Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url} - Status ${status}`,
        error.response?.data
      );

      const normalizedError = handleApiError(error);
      return Promise.reject(normalizedError);
    }
  );

  isInterceptorsRegistered = true;
};
