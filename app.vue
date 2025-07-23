<template>
  <UApp>
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
const jwtToken = useCookie("jwtToken");
jwtToken.value = "3|3QrgsoERXk3sSCY2xDpNqu7819taDstpeKyLEN0N370280be";

const res = await useGet("lawyers", "");
const data = await res.data;

const lawyers = data.data
onMounted(async () => {
  // console.log(useUserAuthStore().userToken);


  // console.log(lawyers[0]);
});
</script>