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
    RESET_PASSWORD: "/auth/reset-password",
  },
  LISTINGS: {
    ROOT: "/listings",
    DETAIL: (id: string | number) => `/listings/${id}`,
    STATUS: (id: string | number) => `/listings/${id}/status`,
  },
  CLIENTS: {
    ROOT: "/clients",
    DETAIL: (id: string | number) => `/clients/${id}`,
    TIMELINE: (id: string | number) => `/clients/${id}/timeline`,
    INTERACTIONS: (id: string | number) => `/clients/${id}/interactions`,
    LISTINGS: (id: string | number) => `/clients/${id}/listings`,
    LINK_LISTING: (id: string | number, listingId: string | number) => `/clients/${id}/listings/${listingId}`,
    CONTEXT: (id: string | number) => `/clients/${id}/context`,
  },
  USERS: {
    ROOT: "/users",
    DETAIL: (id: string | number) => `/users/${id}`,
    STATUS: (id: string | number) => `/users/${id}/status`,
    ROLE: (id: string | number) => `/users/${id}/role`,
  },
  ROLES: {
    ROOT: "/roles",
    ME: "/roles/me",
    USER: (id: string | number) => `/roles/users/${id}`,
    DETAIL: (id: string | number) => `/roles/${id}`,
  }
} as const;
