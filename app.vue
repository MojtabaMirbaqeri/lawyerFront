<template>
  <UApp>
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>

const jwtToken = useCookie("jwtToken");
jwtToken.value = "9|G2ekpZdu3hYO4xFjyfbCBMH9JApDxp0yr5cM9pf0c0242e2b";

// const { data } = await useGet("lawyers");
// console.log(data)
</script>
