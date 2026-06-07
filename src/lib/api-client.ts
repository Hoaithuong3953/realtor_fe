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

/**
 * Helper object for making API requests with file uploads
 * Uses the standard apiClient but handles FormData creation and multipart headers
 */
export const apiWithFiles = {
  /**
   * Helper to send JSON payload alongside Files using the Multipart JSON Pattern
   */
  post: async <T>(url: string, data: unknown, files: File[], fileKey = "files", payloadKey = "payload") => {
    const formData = new FormData();
    formData.append(payloadKey, JSON.stringify(data));
    files.forEach(f => formData.append(fileKey, f));

    return apiClient.post<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  /**
   * Helper to send Files only (e.g. for dedicated upload endpoints)
   */
  put: async <T>(url: string, files: File[], fileKey = "files") => {
    const formData = new FormData();
    files.forEach(f => formData.append(fileKey, f));

    return apiClient.put<T>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
};
