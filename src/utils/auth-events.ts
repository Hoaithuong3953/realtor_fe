import mitt from "mitt";

export type AuthEventPayload = {
  reason: "expired" | "revoked" | "manual_logout";
};

type AuthEvents = {
  SESSION_EXPIRED: AuthEventPayload;
};

/**
 * Lightweight, type-safe global event emitter using mitt
 */
export const authEvents = mitt<AuthEvents>();
