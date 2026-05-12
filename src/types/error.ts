/**
 * Raw validation error detail from FastAPI Backend (Pydantic model)
 */
export interface ApiValidationErrorDetail {
  loc: (string | number)[]; // Path to the field that failed validation, e.g., ["body", "email"]
  msg: string;              // Raw English error message from BE, e.g., "field required"
  type: string;             // Validation error type, e.g., "value_error.missing"
}

/**
 * Structure of raw error responses returned by FastAPI Backend
 */
export interface ApiErrorResponse {
  detail: string | ApiValidationErrorDetail[];
}

/**
 * Normalized error structure returned by FE Base for UI rendering
 */
export interface NormalizedError {
  statusCode: number;                    // HTTP status code (400, 401, 403, 422, 500...)
  fieldErrors?: Record<string, boolean>; // Object mapping field names to boolean flags for form validation (e.g., { email: true })
  raw?: unknown;                         // Original raw error object for debugging purposes
}
