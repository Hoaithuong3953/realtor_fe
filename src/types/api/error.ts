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
 * Normalized error class returned by FE Base for UI rendering.
 * Inherits from Error to comply with ESLint promise rejection requirements.
 */
export class NormalizedError extends Error {
  statusCode: number;                    // HTTP status code (400, 401, 403, 422, 500...)
  fieldErrors?: Record<string, boolean>; // Object mapping field names to boolean flags for form validation (e.g., { email: true })
  raw?: unknown;                         // Original raw error object for debugging purposes

  constructor(statusCode: number, message: string = "API Error", fieldErrors?: Record<string, boolean>, raw?: unknown) {
    super(message);
    this.name = "NormalizedError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.raw = raw;

    // Set prototype explicitly to ensure instanceof works correctly in transpilations
    Object.setPrototypeOf(this, NormalizedError.prototype);
  }
}