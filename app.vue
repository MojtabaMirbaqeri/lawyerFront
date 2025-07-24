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

// const { data } = await useGet("lawyers");
// console.log(data);
</script>