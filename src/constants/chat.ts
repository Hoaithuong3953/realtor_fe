export const ROLE_MAP: Record<string, "ai" | "system" | "user"> = {
  ai: "ai",
  assistant: "ai",
  bot: "ai",
  system: "system",
  user: "user"
}

export const CHAT_SUGGESTIONS = [
  "constants.suggestion_find_apartment",
  "constants.suggestion_find_rent",
  "constants.suggestion_match_client",
  "constants.suggestion_property_highlight",
]

export const CHAT_STREAM_EVENTS = {
  TOKEN: "token",
  INTENT: "intent",
  MESSAGE: "message",
  ERROR: "error",
} as const;
