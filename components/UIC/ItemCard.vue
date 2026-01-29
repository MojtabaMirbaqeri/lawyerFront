<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  badge: { type: String, default: '' },
  badgeVariant: { type: String, default: 'default' },
  highlighted: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
});
</script>

<template>
  <div :class="['item-card', { 'highlighted': highlighted, 'hoverable': hoverable }]">
    <div v-if="$slots.icon || icon" class="item-card-icon">
      <slot name="icon">
        <Icon :name="icon" class="w-5 h-5" />
      </slot>
    </div>
    
    <div class="item-card-content">
      <div class="item-card-header">
        <h4 class="item-card-title">{{ title }}</h4>
        <span v-if="badge" :class="['item-card-badge', badgeVariant]">{{ badge }}</span>
      </div>
      <p v-if="subtitle" class="item-card-subtitle">{{ subtitle }}</p>
      <div v-if="$slots.meta" class="item-card-meta">
        <slot name="meta"></slot>
      </div>
      <slot></slot>
    </div>
    
    <div v-if="$slots.actions" class="item-card-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.item-card {
  @apply flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 transition-all;
}

.item-card.hoverable {
  @apply cursor-pointer hover:border-blue-200 hover:shadow-md;
}

.item-card.highlighted {
  @apply border-green-200 bg-green-50;
  animation: highlight-pulse 1s ease-out;
}

@keyframes highlight-pulse {
  0% {
    background-color: rgba(34, 197, 94, 0.2);
  }
  100% {
    background-color: rgba(240, 253, 244, 1);
  }
}

.item-card-icon {
  @apply w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0;
}

.item-card-content {
  @apply flex-1 min-w-0;
}

.item-card-header {
  @apply flex items-center gap-2 flex-wrap;
}

.item-card-title {
  @apply text-sm font-semibold text-gray-900;
}

.item-card-subtitle {
  @apply text-sm text-gray-500 mt-0.5;
}

.item-card-meta {
  @apply flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400;
}

.item-card-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium;
}

.item-card-badge.default {
  @apply bg-gray-100 text-gray-600;
}

.item-card-badge.success {
  @apply bg-green-100 text-green-700;
}

.item-card-badge.warning {
  @apply bg-amber-100 text-amber-700;
}

.item-card-badge.error {
  @apply bg-red-100 text-red-700;
}

.item-card-actions {
  @apply flex items-center gap-2 shrink-0;
}

@media (max-width: 640px) {
  .item-card {
    @apply flex-col;
  }
  
  .item-card-actions {
    @apply w-full justify-end pt-3 border-t border-gray-100 mt-3;
  }
}
</style>
