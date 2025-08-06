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

  loaderStore.toggleVisiblity();
  document.body.classList.add("overflow-auto!");
});
</script>
