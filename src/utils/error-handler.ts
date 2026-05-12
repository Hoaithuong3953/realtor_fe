import { isAxiosError } from "axios";

import type { ApiErrorResponse } from "@/types";
import { NormalizedError } from "@/types/error";

function getHttpStatus(error: unknown): number {
  if (isAxiosError(error) && error.response?.status !== undefined) {
    return error.response.status;
  }
  return 500;
}

/**
 * Parses raw Axios errors and normalizes them into a clean NormalizedError object for the UI
 */
export function handleApiError(error: unknown): NormalizedError {
  const statusCode = getHttpStatus(error);
  let fieldErrors: Record<string, boolean> | undefined = undefined;

  // Check if it is a network error returned by Axios
  if (isAxiosError<ApiErrorResponse>(error)) {
    const errorData = error.response?.data;

    // Handle 422 validation errors from FastAPI/Pydantic
    if (statusCode === 422 && errorData && Array.isArray(errorData.detail)) {
      fieldErrors = {};
      errorData.detail.forEach((err) => {
        // err.loc contains field path, e.g., ["body", "password"]
        const fieldName = String(err.loc[1] || "general");
        fieldErrors![fieldName] = true; // Mark this field as failed validation
      });
    }
  }

  return new NormalizedError(statusCode, "API Error", fieldErrors, error);
}
