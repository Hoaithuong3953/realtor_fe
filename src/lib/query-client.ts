import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient instance containing standard, production-ready defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents automatic re-fetching of queries when window is refocused
      retry: 1,                    // Retries any failed query request once before reporting failure to the UI
      staleTime: 5 * 60 * 1000,    // Treats cached API data as fresh for up to 5 minutes to limit duplicate network requests
    },
  },
});
