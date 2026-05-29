import { fetchEventSource, type EventSourceMessage } from "@microsoft/fetch-event-source"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/auth.store"
import { logger } from "@/utils/logger"

export interface StreamOptions {
  method?: "GET" | "POST"
  body?: Record<string, unknown>
  signal?: AbortSignal
  onOpen?: (response: Response) => Promise<void>
  onMessage?: (ev: EventSourceMessage) => void
  onError?: (err: unknown) => void
  onClose?: () => void
}

/**
 * Wrapper client for Server-Sent Events (SSE) that automatically inherits
 * Base URL, Tenant settings and Auth tokens from the existing Axios setup
 */
export const sseClient = {
  stream: async (urlPath: string, options: StreamOptions) => {
    // 1. Build Absolute URL
    const baseURL = (apiClient.defaults.baseURL || "").toString().replace(/\/$/, "")
    const url = urlPath.startsWith("http") ? urlPath : `${baseURL}${urlPath}`

    // 2. Attach Headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    }
    
    // Copy tenant slug
    const commonHeaders = (apiClient.defaults.headers as Record<string, Record<string, unknown>>).common || {}
    if (commonHeaders["X-Tenant-Slug"]) {
      headers["X-Tenant-Slug"] = commonHeaders["X-Tenant-Slug"] as string
    }

    // Copy auth token
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`
    } else if (commonHeaders["Authorization"]) {
      headers["Authorization"] = commonHeaders["Authorization"] as string
    }

    // 3. Execute SSE Request
    return fetchEventSource(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
      signal: options.signal,
      async onopen(response) {
        if (options.onOpen) {
          await options.onOpen(response)
        } else {
          if (response.ok && response.headers.get("content-type")?.includes("text/event-stream")) {
            return
          } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`SSE Client error: ${response.status}`)
          }
        }
      },
      onmessage: (ev) => {
        try {
          options.onMessage?.(ev)
        } catch (e) {
          logger.error("Error inside onMessage callback", e)
        }
      },
      onerror: (err) => {
        if (options.onError) options.onError(err)
        throw err // Rethrow to stop library from retrying indefinitely on auth errors
      },
      onclose: () => {
        if (options.onClose) options.onClose()
      }
    })
  }
}
