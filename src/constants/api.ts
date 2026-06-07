export const API_CONFIG = {
  DEFAULT_BASE_URL: "http://localhost:8000/api/v1",
  TIMEOUT: 15000,
  AI_TIMEOUT: 120000, // Timeout for AI endpoints
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
    CHANGE_PASSWORD: "/auth/me/change-password",
  },
  LISTINGS: {
    ROOT: "/listings",
    DETAIL: (id: string | number) => `/listings/${id}`,
    STATUS: (id: string | number) => `/listings/${id}/status`,
    IMPORT_JSON: "/listings/import-json",
    IMPORT_EXCEL: "/listings/import-excel",
    UPLOAD_IMAGE: (id: string | number) => `/listings/${id}/uploadimage`,
    IMPORT_JOBS: "/listings/import-jobs",
    IMPORT_JOB_DETAIL: (id: string | number) => `/listings/import-jobs/${id}`,
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
    ME: "/users/me",
    ME_BROKER_SETTINGS: "/users/me/broker-settings",
    DETAIL: (id: string | number) => `/users/${id}`,
    STATUS: (id: string | number) => `/users/${id}/status`,
    ROLE: (id: string | number) => `/users/${id}/role`,
    IMPORT_EXCEL: "/users/import-excel",
  },
  ROLES: {
    ROOT: "/roles",
    ME: "/roles/me",
    USER: (id: string | number) => `/roles/users/${id}`,
    DETAIL: (id: string | number) => `/roles/${id}`,
  },
  CHAT: {
    SESSIONS: "/chat/sessions",
    SESSION_DETAIL: (id: string | number) => `/chat/sessions/${id}`,
    SESSION_MESSAGES: (id: string | number) => `/chat/sessions/${id}/messages`,
    SESSION_MEMORIES: (id: string | number) => `/chat/sessions/${id}/memories`,
    SESSION_INITIALIZE_MEMORY: (id: string | number) => `/chat/sessions/${id}/initialize-memory`,
    SESSION_RESET_MEMORY: (id: string | number) => `/chat/sessions/${id}/reset-memory`,
    MESSAGE_AI: "/chat/messages/ai",
    MEMORY_DETAIL: (id: string | number) => `/chat/memories/${id}`,
  },
  SEARCH: {
    ROOT: "/search",
    FEEDBACK: "/search/feedback",
  }
} as const;
