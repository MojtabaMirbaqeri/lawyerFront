/**
 * Generate a unique request ID for API correlation (X-Request-Id).
 * Used by API composables to correlate frontend requests with backend logs.
 */
export function useRequestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof require !== "undefined") {
    try {
      return require("node:crypto").randomUUID();
    } catch {
      // fallback
    }
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
