<template>
  <UApp>
    <MainLoader />
    <NuxtLoadingIndicator :height="4" />
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>

onMounted(async () => {
  const loaderStore = useLoaderStore();
  const authStore = useAuthStore();

  const jwtToken = useCookie("jwtToken");
  jwtToken.value = "77|AjaJz9Byo3uywJXphsih9si7UygnGBqFvdP8XcSI8bb8809c";
  loaderStore.toggleVisiblity();
  document.body.classList.add("overflow-auto!");
});
</script>
