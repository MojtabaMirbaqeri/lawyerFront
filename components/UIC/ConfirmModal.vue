<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'تایید' },
  message: { type: String, default: 'آیا از انجام این عملیات اطمینان دارید؟' },
  confirmText: { type: String, default: 'تایید' },
  cancelText: { type: String, default: 'انصراف' },
  variant: { type: String, default: 'danger' },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const iconName = computed(() => {
  const icons = {
    danger: 'lucide:alert-triangle',
    warning: 'lucide:alert-circle',
    info: 'lucide:info',
  };
  return icons[props.variant] || icons.danger;
});

const close = () => {
  isOpen.value = false;
  emit('cancel');
};

const confirm = () => {
  emit('confirm');
};

function onOverlayKeydown(e) {
  if (e.key === 'Escape') close();
}

if (import.meta.client) {
  watch(
    isOpen,
    (open) => {
      if (open) document.addEventListener('keydown', onOverlayKeydown);
      else document.removeEventListener('keydown', onOverlayKeydown);
    },
    { immediate: true }
  );
  onUnmounted(() => document.removeEventListener('keydown', onOverlayKeydown));
}
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div
        v-if="isOpen"
        class="confirm-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        @click.self="close"
      >
        <div class="confirm-modal">
          <div class="confirm-modal-header">
            <div :class="['confirm-icon', variant]">
              <Icon :name="iconName" class="w-6 h-6" />
            </div>
            <h3 id="confirm-modal-title" class="confirm-title">{{ title }}</h3>
            <button @click="close" class="close-btn" type="button" aria-label="بستن">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="confirm-modal-body">
            <p class="confirm-message">{{ message }}</p>
            <slot />
          </div>

          <div class="confirm-modal-footer">
            <button @click="close" class="btn-secondary" type="button">
              {{ cancelText }}
            </button>
            <button
              type="button"
              @click="confirm"
              :class="['btn-confirm', variant]"
              :disabled="loading"
            >
              <Icon v-if="loading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "tailwindcss";

.confirm-overlay {
  @apply fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50;
  width: 100vw;
  min-width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-modal {
  @apply bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl;
}

.confirm-modal-header {
  @apply flex items-center gap-4 px-6 py-4 border-b border-gray-100;
}

.confirm-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center;
}

.confirm-icon.danger {
  @apply bg-red-100 text-red-600;
}

.confirm-icon.warning {
  @apply bg-amber-100 text-amber-600;
}

.confirm-icon.info {
  @apply bg-blue-100 text-blue-600;
}

.confirm-title {
  @apply flex-1 text-lg font-semibold text-gray-900;
}

.close-btn {
  @apply p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors bg-transparent border-none cursor-pointer;
}

.confirm-modal-body {
  @apply px-6 py-5;
}

.confirm-message {
  @apply text-sm text-gray-600 leading-relaxed;
}

.confirm-modal-footer {
  @apply flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-transparent;
}

.btn-secondary {
  @apply px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border-none cursor-pointer;
}

.btn-confirm {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors;
}

.btn-confirm.danger {
  @apply bg-red-600 hover:bg-red-700;
}

.btn-confirm.warning {
  @apply bg-amber-600 hover:bg-amber-700;
}

.btn-confirm.info {
  @apply bg-blue-600 hover:bg-blue-700;
}

.btn-confirm:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
