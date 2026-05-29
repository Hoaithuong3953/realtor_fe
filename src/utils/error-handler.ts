import axios, { isAxiosError } from "axios";
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
export function handleApiError(error: unknown, showToast = true, customErrorMsg?: string, isLoginRequest = false): NormalizedError {
  // Ignore CanceledError entirely to prevent ghost toasts when React Query cancels a request
  if (axios.isCancel(error)) {
    return new NormalizedError(499, "Request canceled", undefined, error);
  }

  const statusCode = getHttpStatus(error);
  let fieldErrors: Record<string, boolean> | undefined = undefined;
  let message = "Unknown error";

  // Check if it is a network error returned by Axios
  if (isAxiosError<unknown>(error)) {
    const errorData = error.response?.data as Record<string, unknown> | undefined;
    
    // Centralized logging for all API errors (for dev debugging)
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN_URL';
    logger.error(`[API Error] ${method} ${url} (HTTP ${statusCode}):`, errorData || error.message);
    
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

  // Bỏ spam toast cho 401 khi hết session (Trừ lúc đang login)
  if (statusCode === 401 && !isLoginRequest) {
    showToast = false;
  }

  let displayMessage = message;

  const i18nKey = `errors.${statusCode}`;
  const translatedMsg = i18n.t(i18nKey);
  
  if ([401, 403, 404, 500].includes(statusCode) && !isLoginRequest) {
    displayMessage = translatedMsg;
  } else if (customErrorMsg) {
    displayMessage = customErrorMsg;
  } else if (translatedMsg && translatedMsg !== i18nKey) {
    displayMessage = translatedMsg;
  }

  if (showToast) {
    toast.error(displayMessage, { id: displayMessage });
  }

  return new NormalizedError(statusCode, displayMessage, fieldErrors, error instanceof NormalizedError ? error.raw : error);
}
