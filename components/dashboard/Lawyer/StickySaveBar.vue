<template>
  <Transition name="slide-up">
    <div v-if="hasChanges" class="sticky-save-bar">
      <div class="save-bar-content">
        <div class="save-bar-info">
          <Icon name="lucide:alert-circle" class="w-5 h-5 text-amber-500" />
          <span class="save-bar-text">تغییرات ذخیره نشده</span>
        </div>
        
        <div class="save-bar-actions">
          <button @click="$emit('reset')" class="btn-ghost" :disabled="isLoading">
            <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
            <span>بازنشانی</span>
          </button>
          <button @click="$emit('save')" class="btn-primary" :disabled="isLoading">
            <Icon v-if="isLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:check" class="w-4 h-4" />
            <span>{{ isLoading ? 'در حال ذخیره...' : 'ذخیره تغییرات' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Confirm Modal -->
  <UModal
    v-model:open="showConfirmModal"
    :ui="{
      width: 'max-w-sm',
      content: 'rounded-2xl shadow-2xl border border-gray-200 bg-white overflow-hidden',
      transition: 'transition-all duration-200 ease-out',
    }"
  >
    <template #content>
      <div class="confirm-modal">
        <div class="confirm-modal-header">
          <h3 class="confirm-modal-title">تغییرات ذخیره نشده</h3>
          <button type="button" @click="showConfirmModal = false" class="confirm-modal-close" aria-label="بستن">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        <div class="confirm-modal-body">
          <p class="confirm-modal-message">
            شما تغییراتی دارید که ذخیره نشده‌اند. آیا می‌خواهید قبل از ترک صفحه ذخیره کنید؟
          </p>
        </div>
        <div class="confirm-modal-footer">
          <button type="button" @click="handleDiscardChanges" class="confirm-btn secondary">
            <Icon name="lucide:x" class="w-4 h-4" />
            نادیده بگیر
          </button>
          <button type="button" @click="handleSaveAndContinue" class="confirm-btn primary">
            <Icon name="lucide:check" class="w-4 h-4" />
            ذخیره و ادامه
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  hasChanges: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
});

const emit = defineEmits(['save', 'reset', 'discard', 'save-and-continue']);

const showConfirmModal = ref(false);
const pendingNavigation = ref(null);

// Method to show confirm modal before navigation
const confirmBeforeLeave = (callback) => {
  if (props.hasChanges) {
    pendingNavigation.value = callback;
    showConfirmModal.value = true;
    return false;
  }
  return true;
};

const handleDiscardChanges = () => {
  showConfirmModal.value = false;
  emit('discard');
  if (pendingNavigation.value) {
    pendingNavigation.value();
    pendingNavigation.value = null;
  }
};

const handleSaveAndContinue = () => {
  showConfirmModal.value = false;
  emit('save-and-continue');
};

// Expose method for parent component
defineExpose({
  confirmBeforeLeave,
  showConfirmModal: () => { showConfirmModal.value = true; },
});
</script>

<style scoped>
@reference "tailwindcss";

.sticky-save-bar {
  @apply fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  margin-right: 280px; /* Match sidebar width */
}

@media (max-width: 1023px) {
  .sticky-save-bar {
    margin-right: 0;
  }
}

.save-bar-content {
  @apply flex items-center justify-between px-6 py-3 max-w-[1400px] mx-auto;
}

.save-bar-info {
  @apply flex items-center gap-2;
}

.save-bar-text {
  @apply text-sm font-medium text-gray-700;
}

.save-bar-actions {
  @apply flex items-center gap-3;
}

.btn-ghost,
.btn-primary {
  @apply inline-flex items-center gap-2;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Confirm Modal */
.confirm-modal {
  @apply w-full;
}

.confirm-modal-header {
  @apply flex items-center justify-between gap-4 px-5 py-4;
  border-bottom: 1px solid rgb(243 244 246);
}

.confirm-modal-title {
  @apply text-base font-semibold text-gray-900;
}

.confirm-modal-close {
  @apply p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors;
}

.confirm-modal-body {
  @apply px-5 py-4;
}

.confirm-modal-message {
  @apply text-sm text-gray-600 leading-relaxed;
}

.confirm-modal-footer {
  @apply flex items-center justify-end gap-3 px-5 py-4;
  border-top: 1px solid rgb(243 244 246);
}

.confirm-btn {
  @apply inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors;
}

.confirm-btn.secondary {
  @apply text-gray-700 bg-gray-100 hover:bg-gray-200;
}

.confirm-btn.primary {
  @apply text-white bg-blue-600 hover:bg-blue-700;
}
</style>
