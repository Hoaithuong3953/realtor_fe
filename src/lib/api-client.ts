import axios from "axios";

import { API_CONFIG } from "@/constants/api";

/**
 * Pristine, generic Axios client instance.
 * All domain-specific interceptors (e.g., auth tokens) are dynamically layered on top of this client.
 */
export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || API_CONFIG.DEFAULT_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Tenant-Slug": "realtor-demo",
  },
});
