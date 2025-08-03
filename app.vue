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
jwtToken.value = "46|8b26u5jtAKJKjKS3iawBBs8SuRCsTYUaGxiVsv1Bc8ef5204";
</script>
