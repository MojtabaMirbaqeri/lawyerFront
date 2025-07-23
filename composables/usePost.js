export async function usePost(url,token,body){
    const endPoint = useRuntimeConfig().public.apiEndpoint
    try{
        const response = await $fetch(endPoint+url,{
            headers:{
                Authorization:token ? "Bearer "+token : ''
            },
            method:"POST",
            body:body
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