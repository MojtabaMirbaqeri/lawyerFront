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
