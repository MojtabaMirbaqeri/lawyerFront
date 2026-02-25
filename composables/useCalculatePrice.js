export function useCalculatePrice(duration, price, copun = null) {
  const finalPrice = ref((duration / 30) * price);
  const finalOffer = ref(0);
  const mainPrice = ref((duration / 30) * price);
  if (copun) {
    if (copun?.type === "amount") {
      finalPrice.value = finalPrice.value - copun.value;
      finalOffer.value = copun.value;
    } else {
      finalOffer.value = finalPrice.value * (copun.value / 100);
      finalPrice.value = finalPrice.value - finalPrice.value * (copun.value / 100);
    }
  }
  return {
    price: finalPrice.value,
    offerValue: finalOffer.value || 0,
    mainPrice: mainPrice.value,
  };
}
