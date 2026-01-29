<template>
  <button @click="useAuthStore().logout()" class="logout-btn" :class="{ 'collapsed': collapsed }">
    <Icon name="lucide:log-out" class="logout-icon" />
    <span v-if="!collapsed" class="logout-text">خروج از حساب</span>
  </button>
</template>

<script setup>
defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.logout-btn {
  @apply flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150;
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.logout-btn.collapsed {
  @apply justify-center;
}

.logout-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.logout-text {
  @apply whitespace-nowrap;
}
</style>