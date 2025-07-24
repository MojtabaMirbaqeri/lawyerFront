export async function useGet(url, includeAuthHeader = false) {
  const config = useRuntimeConfig();
  const jwtToken = useCookie("jwtToken");

  const headers = {
    ...(includeAuthHeader && jwtToken.value
      ? { Authorization: `Bearer ${jwtToken.value}` }
      : {}),
  };

  const isClient = typeof window !== "undefined";

  // Runtime fetch (e.g., inside watch, event handlers)
  if (isClient) {
    try {
      const data = await $fetch(config.public.apiEndpoint + url, { headers });

      return {
        data,
        status: true,
        statusCode: data?.status ?? 200,
        pending: false,
        refresh: async () => {
          const newData = await $fetch(config.public.apiEndpoint + url, { headers });
          return newData;
        },
      };
    } catch (error) {
      return {
        data: null,
        status: false,
        statusCode: error?.response?.status || 500,
        error: error?.message || "An unknown error occurred",
        pending: false,
        refresh: null,
      };
    }
  }

  // SSR/Setup fetch (Nuxt useFetch)
  try {
    const response = await useFetch(config.public.apiEndpoint + url, {
      headers,
    });

    return {
      data: response.data.value,
      status: response.status.value || true,
      statusCode: response.status.value ? response.status.value : 200,
      pending: response.pending.value,
      refresh: response.refresh,
    };
  } catch (error) {
    return {
      data: null,
      status: false,
      statusCode: 500,
      error: error.message || "An unknown error occurred",
      pending: false,
      refresh: null,
    };
  }
}
