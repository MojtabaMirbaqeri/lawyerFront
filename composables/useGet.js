export async function useGet(url,token){
    const endPoint = useRuntimeConfig().public.apiEndpoint
    try{
        const response = await useFetch(endPoint+url,{
            headers:{
                Authorization:token ? "Bearer "+token : ''
            }
        })
        
        return{
            data:response.data.value,
            status: response.status.value || true,
        }
    }
    catch(error){
        return{
            status: false,
            data: null,
            error: error.message || "An unknown error occurred",
        }
    }
}