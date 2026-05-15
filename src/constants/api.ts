export const API_CONFIG = {
  DEFAULT_BASE_URL: "http://localhost:8000/api/v1",
  TIMEOUT: 15000,
} as const;

/**
 * Centralized registry of all Backend API endpoints, grouped by domain
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
} as const;
