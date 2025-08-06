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
jwtToken.value = "77|AjaJz9Byo3uywJXphsih9si7UygnGBqFvdP8XcSI8bb8809c";
</script>
