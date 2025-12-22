export async function usePost(
  request = { url: "", includeAuthHeader: false, body: {} },
  showMessage = true
) {
  const endPoint = useRuntimeConfig().public.apiEndpoint;
  const jwtToken = useCookie("jwtToken");

  const isFormData = typeof FormData !== "undefined" && request.body instanceof FormData;

  const headers = {
    ...(request.includeAuthHeader && jwtToken.value
      ? { Authorization: `Bearer ${jwtToken.value}` }
      : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
  };

  try {
    const response = await $fetch(endPoint + request.url, {
      method: "POST",
      headers,
      body: isFormData ? request.body : JSON.stringify(request.body),
    });

    return {
      data: response.data?.value ?? response,
      status: response.status?.value || true,
      statusCode: response.status?.value || 200,
      pending: false,
    };
  } catch (error) {
    if (error.status == 500) {
      useToast().add({
        color: "error",
        description: "خطای فنی رخ داده است.",
      });
    }
    const rawMessage =
      error?.data?.data?.errors ||
      error?.data?.message ||
      error?.response?._data?.message ||
      null;

    // Convert rawMessage to string if it's an object
    let errorMessage = null;
    if (rawMessage) {
      if (typeof rawMessage === "string") {
        errorMessage = rawMessage.replace(/\s*\(and\s+\d+\s+more\s+errors?\)/gi, "");
      } else if (typeof rawMessage === "object") {
        // Extract all error messages from object
        const messages = [];

        Object.values(rawMessage).forEach((errors) => {
          if (Array.isArray(errors)) {
            messages.push(...errors);
          } else if (typeof errors === "string") {
            messages.push(errors);
          }
        });

        errorMessage = messages[0];
      }
    }

    // Show toast error if message exists and showMessage is true
    if (errorMessage && showMessage) {
      useToast().add({
        description: errorMessage,
        color: "error",
      });
    }

    return {
      status: false,
      pending: false,
      statusCode: error?.response?.status || 500,
      data: null,
      error: error.message || "An unknown error occurred",
      message: errorMessage,
    };
  }
}
