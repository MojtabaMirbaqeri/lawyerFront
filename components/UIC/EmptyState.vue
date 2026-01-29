<script setup>
const props = defineProps({
  icon: { type: String, default: 'lucide:inbox' },
  title: { type: String, default: 'داده‌ای یافت نشد' },
  description: String,
  actionText: String,
  actionTo: String,
});

const emit = defineEmits(['action']);
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <Icon :name="icon" class="w-8 h-8" />
    </div>
    <h4 class="empty-state-title">{{ title }}</h4>
    <p v-if="description" class="empty-state-description">{{ description }}</p>
    <div v-if="actionText" class="empty-state-action">
      <NuxtLink v-if="actionTo" :to="actionTo" class="btn-primary">
        {{ actionText }}
      </NuxtLink>
      <button v-else @click="emit('action')" class="btn-primary">
        {{ actionText }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-center;
}

.empty-state-icon {
  @apply w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4;
  color: var(--ui-gray);
}

.empty-state-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.empty-state-description {
  @apply text-sm text-gray-500 max-w-sm mb-6;
}

.empty-state-action .btn-primary {
  @apply inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium;
}
</style>
