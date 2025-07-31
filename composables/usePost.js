export async function usePost(request = { url: '', includeAuthHeader: false, body: {} }) {
    const endPoint = useRuntimeConfig().public.apiEndpoint
    const jwtToken = useCookie("jwtToken");

    console.log(request.url);
    

    const headers = {
        ...(request.includeAuthHeader && jwtToken.value
            ? { Authorization: `Bearer ${jwtToken.value}` }
            : {}),
    };
    try {
        const response = await $fetch(endPoint + request.url, {
            headers,
            method: "POST",
            body: JSON.stringify(request.body)
        })

        return {
            data: response.data.value,
            status: response.status.value || true,
            statusCode: response.status.value ? response.status.value : 200,
            pending: false
        }
    }
    catch (error) {
        return {
            status: false,
            pending: false,
            statusCode: error?.response?.status || 500,
            data: null,
            error: error.message || "An unknown error occurred",
        }
    }
}