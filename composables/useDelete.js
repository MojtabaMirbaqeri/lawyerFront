// composables/useDelete.js
export async function useDelete(
  request = {
    url: "",
    includeAuthHeader: false,
    query: {},
    body: null,
  }
) {
  const config = useRuntimeConfig();
  const jwtToken = useCookie("jwtToken");

  const headers = {
    ...(request.includeAuthHeader && jwtToken.value
      ? { Authorization: `Bearer ${jwtToken.value}` }
      : {}),
  };

  try {
    const data = await $fetch(config.public.apiEndpoint + request.url, {
      method: "DELETE",
      headers,
      query: request.query,
      body: request.body,
    });

    return {
      data,
      status: true,
      statusCode: data?.status ?? 200,
      pending: false,
      refresh: async () => {
        const newData = await $fetch(config.public.apiEndpoint + request.url, {
          method: "DELETE",
          headers,
          query: request.query,
          body: request.body,
        });
        return newData;
      },
    };
  } catch (error) {
    const rawMessage =
      error?.data?.message || error?.response?._data?.message || null;
    
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
        errorMessage = messages.join(" ");
      }
    }

    return {
      data: null,
      status: false,
      statusCode: error?.response?.status || 500,
      error: error?.message || "An unknown error occurred",
      message: errorMessage,
      pending: false,
      refresh: null,
    };
  }
}
