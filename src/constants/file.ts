export const SUPPORTED_FILE_TYPES = {
  excel: {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/vnd.ms-excel": [".xls"],
  },
  csv: {
    "text/csv": [".csv"],
  },
  json: {
    "application/json": [".json"],
  },
  image: {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
  }
} as const;

export type FileTypeKey = keyof typeof SUPPORTED_FILE_TYPES;
