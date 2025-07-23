<template>
  <UApp>
    <NuxtLayout dir="rtl">
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>

const { data } = await useGet("lawyers");
console.log(data);
</script>