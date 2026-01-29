<script setup>
defineProps({
  height: { type: String, default: '200px' },
});
</script>

<template>
  <div class="skeleton-card" :style="{ height }">
    <div class="skeleton-shimmer"></div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.skeleton-card {
  @apply bg-gray-100 rounded-xl relative overflow-hidden;
}

.skeleton-shimmer {
  @apply absolute inset-0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
