<template>
  <div>
    <ClientOnly>
      {{ authStore.user }}
    </ClientOnly>
  </div>
</template>
<script setup>
const authStore = useAuthStore();
</script>