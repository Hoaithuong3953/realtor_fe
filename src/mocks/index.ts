// Export all mock data
export * from "./users";
export * from "./listings";
export * from "./clients";
export * from "./chat";

// Utility function to get mock data with delay (simulates API call)
export const withDelay = async <T>(data: T, delayMs: number = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
};

// Mock API response wrapper
export const mockApiResponse = <T,>(data: T, success: boolean = true) => ({
  success,
  data,
  timestamp: new Date().toISOString(),
});
