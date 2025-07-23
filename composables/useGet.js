export async function useGet(url, includeAuthHeader = false) {
  const endPoint = useRuntimeConfig().public.apiEndpoint;
  const jwtToken = useCookie("jwtToken");
  console.log(jwtToken);
  

  try {
    const response = await useFetch(endPoint + url, {
      headers: {
        Authorization:
          includeAuthHeader && jwtToken ? `Bearer ${jwtToken.value}` : undefined,
      },
    });
    return {
      data: response.data.value,
      status: response.status.value || true,
      pendeing: response.pending.value,
      refresh: response.refresh,
    };
  } catch (error) {
    return {
      status: false,
      data: null,
      error: error.message || "An unknown error occurred",
    };
  }
}
