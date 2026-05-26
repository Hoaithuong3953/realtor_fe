/**
 * Helper utility to standardize UTC timestamps to local vi-VN (GMT+7) strings
 */

/**
 * Formats date input into DD/MM/YYYY HH:mm:ss
 */
export function formatDateTime(input?: string | number | Date | null): string {
  if (!input) {
    return "";
  }
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return "";
    }

    const dateString = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeString = date.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return `${dateString} ${timeString}`;
  } catch {
    return "";
  }
}

/**
 * Formats date input into DD/MM/YYYY
 */
export function formatDateOnly(input?: string | number | Date | null): string {
  if (!input) {
    return "";
  }
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Categorize a date string into "today", "last7days", or "older"
 */
export function getDateGroupKey(dateString: string): "today" | "last7days" | "older" {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "older"

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)
    
    const diffTime = today.getTime() - targetDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "today"
    if (diffDays <= 7) return "last7days"
    return "older"
  } catch {
    return "older"
  }
}


/**
 * Formats date input into HH:mm DD/MM/YYYY
 */
export function formatShortDateTime(input?: string | number | Date | null): string {
  if (!input) {
    return "";
  }
  try {
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      return "";
    }

    const dateString = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const timeString = date.toLocaleTimeString("vi-VN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${timeString} ${dateString}`;
  } catch {
    return "";
  }
}