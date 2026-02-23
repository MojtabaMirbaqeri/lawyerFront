import { parseApiErrorMessage, showApiErrorToast } from "./useApiError";

export async function usePut(
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
    showApiErrorToast(error, { showMessage });
    return {
      status: false,
      pending: false,
      statusCode: error?.response?.status || error?.status || 500,
      data: error?.data ?? error?.response?._data ?? null,
      error: error?.message || "An unknown error occurred",
      message: parseApiErrorMessage(error),
    };
  }
}
