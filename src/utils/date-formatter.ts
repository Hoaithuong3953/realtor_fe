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
