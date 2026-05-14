 
/* eslint-disable no-console -- centralized logging abstraction */
import { formatDateTime } from "./date-formatter";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

class Logger {
  // Automatically detect Vite environment: true in local dev, false in production build
  private isDev = import.meta.env.DEV;

  /**
   * Recursive sanitizer to scrub sensitive data, protecting performance and preventing circular references
   */
  private sanitize(data: unknown): unknown {
    const sensitiveKeys = [
      "password",
      "token",
      "access_token",
      "refresh_token",
      "authorization",
      "client_secret",
      "email",
      "phone",
    ];

    // Track visited references to prevent stack overflow crashes on circular structures
    const visited = new WeakSet<object>();

    const scrub = (val: unknown, depth = 0): unknown => {
      // Guard clause: enforce maximum traversal depth to avoid blocking the main thread
      if (depth > 5) {
        return "[Object (Max Traversal Depth Reached)]";
      }

      if (val === null || val === undefined) {
        return val;
      }

      if (typeof val !== "object") {
        return val;
      }

      const obj = val;

      // Safeguard: detect circular references
      if (visited.has(obj)) {
        return "[Circular Reference]";
      }
      visited.add(obj);

      // Guard clause: limit maximum logged array elements to prevent RAM starvation
      if (Array.isArray(val)) {
        if (val.length > 10) {
          const truncated = val.slice(0, 10).map((item) => scrub(item, depth + 1));
          truncated.push(`[... ${val.length - 10} more items truncated]`);
          visited.delete(obj);
          return truncated;
        }
        const cleanArray = val.map((item) => scrub(item, depth + 1));
        visited.delete(obj);
        return cleanArray;
      }

      const record = val as Record<string, unknown>;
      const cleanObj: Record<string, unknown> = {};
      for (const key of Object.keys(record)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
          cleanObj[key] = "[REDACTED_SENSITIVE_DATA]";
        } else {
          cleanObj[key] = scrub(record[key], depth + 1);
        }
      }

      // Cleanup tracker reference for sister branches
      visited.delete(obj);
      return cleanObj;
    };

    return scrub(data);
  }

  /**
   * Central log execution function
   */
  private log(level: LogLevel, message: string, ...params: unknown[]) {
    // In production, block all standard logs except ERROR for security and console cleanliness
    if (!this.isDev && level !== "ERROR") {
      return;
    }

    // Format timestamp in GMT+7 using centralized date formatter
    const prefix = `[${formatDateTime(new Date())}] [${level}]`;

    // Distinct styling for each log level in the browser Console during development
    const styles = {
      DEBUG: "color: #7f8c8d; font-weight: 500;",
      INFO: "color: #2ecc71; font-weight: bold;",
      WARN: "color: #f1c40f; font-weight: bold;",
      ERROR: "color: #e74c3c; font-weight: bold;",
    };

    // Sanitize any metadata or raw objects before logging to prevent leaking sensitive information
    const cleanParams = params.map((param) => this.sanitize(param));

    switch (level) {
      case "DEBUG":
        console.debug(`%c${prefix} ${message}`, styles.DEBUG, ...cleanParams);
        break;
      case "INFO":
        console.info(`%c${prefix} ${message}`, styles.INFO, ...cleanParams);
        break;
      case "WARN":
        console.warn(`%c${prefix} ${message}`, styles.WARN, ...cleanParams);
        break;
      case "ERROR":
        console.error(`%c${prefix} ${message}`, styles.ERROR, ...cleanParams);
        break;
    }
  }

  public debug(message: string, ...params: unknown[]) {
    this.log("DEBUG", message, ...params);
  }

  public info(message: string, ...params: unknown[]) {
    this.log("INFO", message, ...params);
  }

  public warn(message: string, ...params: unknown[]) {
    this.log("WARN", message, ...params);
  }

  public error(message: string, ...params: unknown[]) {
    this.log("ERROR", message, ...params);
  }
}

export const logger = new Logger();
