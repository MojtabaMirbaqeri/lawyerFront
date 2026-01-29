<script setup>
const props = defineProps({
  icon: { type: String, required: true },
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  change: { type: Number, default: null },
  variant: { type: String, default: 'primary' }, // primary, success, warning, error, info
  loading: { type: Boolean, default: false },
});

const variantClasses = {
  primary: '',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};
</script>

<template>
  <div class="stat-card">
    <div class="stat-card-icon" :class="variantClasses[variant]">
      <Icon v-if="!loading" :name="icon" class="w-6 h-6 text-white" />
      <Icon v-else name="lucide:loader-2" class="w-6 h-6 text-white animate-spin" />
    </div>
    <div class="stat-content">
      <span v-if="!loading" class="stat-card-value">{{ value }}</span>
      <div v-else class="skeleton skeleton-text w-20 h-8"></div>
      
      <span class="stat-card-label">{{ label }}</span>
      
      <span v-if="change !== null && !loading" class="stat-card-change" :class="change >= 0 ? 'positive' : 'negative'">
        <Icon :name="change >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
        {{ Math.abs(change) }}%
      </span>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.stat-card {
  @apply bg-white rounded-xl p-5 border border-gray-100 flex items-start gap-4;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}

.stat-card-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark, #2563eb));
}

.stat-card-icon.success {
  background: linear-gradient(135deg, var(--status-success), #16a34a);
}

.stat-card-icon.warning {
  background: linear-gradient(135deg, var(--status-warning), #d97706);
}

.stat-card-icon.error {
  background: linear-gradient(135deg, var(--status-error), #dc2626);
}

.stat-card-icon.info {
  background: linear-gradient(135deg, var(--status-info), #0284c7);
}

.stat-content {
  @apply flex flex-col flex-1;
}

.stat-card-value {
  @apply text-2xl lg:text-3xl font-bold text-gray-900;
}

.stat-card-label {
  @apply text-sm text-gray-500 font-medium;
}

.stat-card-change {
  @apply text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-2 w-fit;
}

.stat-card-change.positive {
  @apply bg-green-50 text-green-600;
}

.stat-card-change.negative {
  @apply bg-red-50 text-red-600;
}

.skeleton {
  @apply bg-gray-200 rounded animate-pulse;
}
</style>
