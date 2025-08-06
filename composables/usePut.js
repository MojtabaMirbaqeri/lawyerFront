export async function usePut(request = { url: "", includeAuthHeader: false, body: {} }) {
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
      method: "PUT",
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
    return {
      status: false,
      pending: false,
      statusCode: error?.response?.status || 500,
      data: null,
      error: error.message || "An unknown error occurred",
    };
  }
}
