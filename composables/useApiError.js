/**
 * Shared API error parsing and toast handling for useGet, usePost, usePut, usePatch, useDelete.
 * @param {import('ofetch').FetchError} error
 * @returns {string|null} Human-readable error message or null
 */
export function parseApiErrorMessage(error) {
  const rawMessage =
    error?.data?.message ??
    error?.data?.errors ??
    error?.response?._data?.message ??
    error?.response?._data?.errors ??
    null;

  if (!rawMessage) return null;

  if (typeof rawMessage === "string") {
    return rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors?\)/gi, "").trim() || null;
  }

  if (typeof rawMessage === "object") {
    const messages = [];
    Object.values(rawMessage).forEach((errors) => {
      if (Array.isArray(errors)) {
        messages.push(...errors);
      } else if (typeof errors === "string") {
        messages.push(errors);
      }
    });
    return messages.length ? messages.join(" ") : null;
  }

  return null;
}

/**
 * Show toast for API error (generic 500 and/or parsed message). Call from composables.
 * @param {import('ofetch').FetchError} error
 * @param {{ showMessage?: boolean }} options
 */
export function showApiErrorToast(error, options = {}) {
  const { showMessage = true } = options;
  const status = error?.status ?? error?.response?.status;

  if (status === 500) {
    useToast().add({
      color: "error",
      description: "خطای فنی رخ داده است.",
    });
  }

  const errorMessage = parseApiErrorMessage(error);
  if (errorMessage && showMessage) {
    useToast().add({
      description: errorMessage,
      color: "error",
    });
  }
}
