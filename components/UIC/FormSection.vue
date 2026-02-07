<script setup>
const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  icon: { type: String, default: "" },
  required: { type: Boolean, default: false },
  collapsible: { type: Boolean, default: false },
  defaultCollapsed: { type: Boolean, default: false },
});

const isCollapsed = ref(props.defaultCollapsed);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="form-section" :class="{ collapsible: collapsible, collapsed: isCollapsed }">
    <!-- Header Row: Title + Chevron -->
    <div class="form-section-header" @click="collapsible && toggleCollapse()">
      <div class="form-section-title-wrap">
        <Icon v-if="icon" :name="icon" class="form-section-icon" />
        <div class="form-section-text">
          <h3 class="form-section-title">
            {{ title }}
            <span v-if="required" class="text-red-500">*</span>
          </h3>
          <p v-if="description" class="form-section-description">{{ description }}</p>
        </div>
      </div>
      <!-- Desktop: Actions inline, Mobile: Only chevron here -->
      <div class="form-section-header-actions">
        <div class="hidden sm:flex items-center gap-2">
          <slot name="actions" />
        </div>
        <button
          v-if="collapsible"
          type="button"
          class="collapse-btn"
          @click.stop="toggleCollapse()">
          <Icon
            :name="isCollapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'"
            class="w-5 h-5" />
        </button>
      </div>
    </div>
    <!-- Mobile: Actions below header -->
    <div v-if="$slots.actions" class="form-section-mobile-actions sm:hidden">
      <slot name="actions" />
    </div>
    <Transition name="collapse">
      <div v-show="!isCollapsed" class="form-section-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.form-section {
  @apply bg-white rounded-xl border border-gray-100 overflow-hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

@media (max-width: 639px) {
  .form-section {
    @apply rounded-lg;
  }
}

.form-section-header {
  @apply flex items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4;
}

.collapsible .form-section-header {
  @apply cursor-pointer transition-colors;
}

.collapsible .form-section-header:hover {
  @apply bg-gray-50;
}

.form-section-title-wrap {
  @apply flex items-center gap-2 min-w-0 flex-1 sm:gap-3;
}

.form-section-icon {
  @apply w-5 h-5 shrink-0 text-gray-400;
}

.form-section-text {
  @apply flex flex-col min-w-0;
}

.form-section-title {
  @apply text-sm font-semibold text-gray-900 leading-snug sm:text-base;
}

.form-section-description {
  @apply text-xs text-gray-500 mt-0.5 leading-snug sm:text-sm;
}

.form-section-header-actions {
  @apply flex items-center gap-1.5 shrink-0 sm:gap-2;
}

.form-section-mobile-actions {
  @apply px-4 pb-3 flex;
}

.collapse-btn {
  @apply p-2 rounded-lg text-gray-400 bg-transparent border-none cursor-pointer transition-colors touch-manipulation sm:p-1.5;
}

.collapse-btn:hover {
  @apply bg-gray-100;
}

.form-section-content {
  @apply px-4 pb-4 pt-2 border-t border-gray-100 sm:px-6 sm:pb-6;
}

/* Mobile: adjust padding */
@media (max-width: 639px) {
  .form-section-content {
    @apply px-3 pb-3;
  }
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
