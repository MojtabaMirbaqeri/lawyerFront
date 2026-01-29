<script setup>
const props = defineProps({
  type: { type: String, default: 'text' }, // text, title, avatar, button, card, table-row
  width: String,
  height: String,
  count: { type: Number, default: 1 },
});

const typeClasses = {
  text: 'skeleton-text h-4',
  title: 'skeleton-title h-6 w-1/3',
  avatar: 'skeleton-avatar w-10 h-10',
  button: 'skeleton-button h-10 w-24',
  card: 'skeleton-card h-32 w-full',
  'table-row': 'skeleton-table-row h-12 w-full',
};
</script>

<template>
  <div class="skeleton-wrapper">
    <div 
      v-for="i in count" 
      :key="i"
      class="skeleton"
      :class="typeClasses[type]"
      :style="{ width: width, height: height }"
    ></div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.skeleton-wrapper {
  @apply space-y-3;
}

.skeleton {
  @apply bg-gray-200 rounded animate-pulse;
}

.skeleton-text {
  @apply h-4 rounded;
}

.skeleton-text:nth-child(odd) {
  @apply w-full;
}

.skeleton-text:nth-child(even) {
  @apply w-4/5;
}

.skeleton-title {
  @apply h-6 rounded w-1/3;
}

.skeleton-avatar {
  @apply w-10 h-10 rounded-full;
}

.skeleton-button {
  @apply h-10 w-24 rounded-lg;
}

.skeleton-card {
  @apply h-32 w-full rounded-xl;
}

.skeleton-table-row {
  @apply h-12 w-full rounded-lg;
}
</style>
