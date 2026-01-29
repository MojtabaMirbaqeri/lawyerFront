<script setup>
const props = defineProps({
  value: { type: Number, default: 0 },
  showValue: { type: Boolean, default: false },
  size: { type: String, default: 'md' }, // sm, md, lg
  variant: { type: String, default: 'primary' }, // primary, success, warning, error
  animated: { type: Boolean, default: true },
  label: String,
});

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

const variantClasses = {
  primary: 'progress-bar-fill',
  success: 'progress-bar-fill success',
  warning: 'progress-bar-fill warning',
  error: 'progress-bar-fill error',
};

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)));
</script>

<template>
  <div class="uic-progress-wrapper">
    <div v-if="label || showValue" class="uic-progress-header">
      <span v-if="label" class="uic-progress-label">{{ label }}</span>
      <span v-if="showValue" class="uic-progress-value">{{ clampedValue }}%</span>
    </div>
    <div class="progress-bar" :class="sizeClasses[size]">
      <div 
        :class="[variantClasses[variant], { 'animated': animated }]"
        :style="{ width: `${clampedValue}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.uic-progress-wrapper {
  @apply w-full;
}

.uic-progress-header {
  @apply flex items-center justify-between mb-1.5;
}

.uic-progress-label {
  @apply text-sm font-medium text-gray-700;
}

.uic-progress-value {
  @apply text-sm font-medium text-gray-900;
}

.progress-bar {
  @apply w-full rounded-full overflow-hidden;
  background: var(--surface-subtle);
}

.progress-bar-fill {
  @apply h-full rounded-full;
  background: var(--accent);
  transition: width 0.5s ease;
}

.progress-bar-fill.success {
  background: var(--status-success);
}

.progress-bar-fill.warning {
  background: var(--status-warning);
}

.progress-bar-fill.error {
  background: var(--status-error);
}

.progress-bar-fill.animated {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
  animation: progress-animation 1s linear infinite;
}

@keyframes progress-animation {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>