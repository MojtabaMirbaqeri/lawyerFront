export function useCalculatePrice(duration, price, copun=null) {
    const finalPrice = ref((duration / 30) * price)
    if(copun){
        if (copun?.type === 'amount') {
            finalPrice.value = finalPrice.value - copun.value
        }
        else {
            finalPrice.value = finalPrice.value - (finalPrice.value * (copun.value / 100))
        }
    }

    return finalPrice.value
}
