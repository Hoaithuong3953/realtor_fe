import { isAxiosError } from "axios";
import { toast } from "sonner";
import i18n from "@/i18n";
import { logger } from "@/utils/logger";

import { NormalizedError } from "@/types/api";

function getHttpStatus(error: unknown): number {
  if (error instanceof NormalizedError) {
    return error.statusCode;
  }
  if (isAxiosError(error) && error.response?.status !== undefined) {
    return error.response.status;
  }
  return 500;
}

/**
 * Parses raw Axios errors and normalizes them into a clean NormalizedError object for the UI
 */
export function handleApiError(error: unknown, showToast = true): NormalizedError {
  const statusCode = getHttpStatus(error);
  let fieldErrors: Record<string, boolean> | undefined = undefined;
  let message = "Unknown error";
  const isServerError = statusCode >= 500;

  // Check if it is a network error returned by Axios
  if (isAxiosError<unknown>(error)) {
    const errorData = error.response?.data as Record<string, unknown> | undefined;
    
    // Extract message from BaseResponse
    if (errorData?.message && typeof errorData.message === "string") {
      message = errorData.message;
    } else if (errorData?.detail && typeof errorData.detail === "string") {
      message = errorData.detail;
    } else if (error.message) {
      message = error.message;
    }

    // Handle 422 validation errors from FastAPI/Pydantic
    if (statusCode === 422 && errorData && Array.isArray(errorData.detail)) {
      fieldErrors = {};
      errorData.detail.forEach((err: unknown) => {
        const errorDetail = err as { loc?: unknown[] };
        // err.loc contains field path, e.g., ["body", "password"]
        const fieldName = errorDetail.loc && typeof errorDetail.loc[1] === "string" ? errorDetail.loc[1] : "general";
        fieldErrors![fieldName] = true; // Mark this field as failed validation
      });
      // Do not show global toast for field validation errors
      showToast = false;
    }
  } else if (error instanceof NormalizedError) {
    message = error.message;
    fieldErrors = error.fieldErrors;
  } else if (error instanceof Error) {
    message = error.message;
  }

  // 401 is handled by Auth Interceptor, don't spam toast
  if (statusCode === 401) {
    showToast = false;
  }

  // Security: Sanitize error messages for 5xx
  let displayMessage = message;
  if (isServerError) {
    // Log the real backend error to console for devs
    logger.error(`[Sanitized] Real Backend Error (HTTP ${statusCode}):`, message);
    
    // Override user-facing message with safe text
    displayMessage = i18n.t("errors.500");
  } else {
    // For 4xx errors, check a predefined translation for this status code
    const i18nKey = `errors.${statusCode}`;
    const translatedMsg = i18n.t(i18nKey);
    // If translation exists and is not the key itself
    if (translatedMsg && translatedMsg !== i18nKey) {
      displayMessage = translatedMsg;
    }
  }

  if (showToast) {
    toast.error(displayMessage);
  }

  return new NormalizedError(statusCode, displayMessage, fieldErrors, error instanceof NormalizedError ? error.raw : error);
}
