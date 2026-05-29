import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { handleApiError } from "@/utils/error-handler";

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
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show global toast if the local query doesn't handle it
      if (query.meta?.errorMessage !== false) {
        handleApiError(error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.errorMessage !== false) {
        const errorMsg = typeof mutation.meta?.errorMsg === 'string' ? mutation.meta.errorMsg : undefined;
        const isLoginRequest = mutation.meta?.isLoginRequest === true;
        handleApiError(error, true, errorMsg, isLoginRequest);
      }
    },
  }),
});
