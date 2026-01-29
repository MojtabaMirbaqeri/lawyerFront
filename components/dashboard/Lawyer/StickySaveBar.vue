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
  <UModal v-model:open="showConfirmModal">
    <template #content>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">تغییرات ذخیره نشده</h3>
          <button @click="showConfirmModal = false" class="btn-icon">
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>
        <div class="modal-body">
          <div class="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <Icon name="lucide:alert-triangle" class="w-6 h-6 text-amber-500" />
            <p class="text-sm text-amber-700">شما تغییراتی دارید که ذخیره نشده‌اند. آیا می‌خواهید قبل از ترک صفحه ذخیره کنید؟</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="handleDiscardChanges" class="btn-secondary">
            <Icon name="lucide:x" class="w-4 h-4" />
            نادیده بگیر
          </button>
          <button @click="handleSaveAndContinue" class="btn-primary">
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

/* Modal Styles */
.modal-content {
  @apply bg-white rounded-xl w-full max-w-md;
}

.modal-header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-100;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-body {
  @apply px-6 py-5;
}

.modal-footer {
  @apply flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100;
}

.btn-secondary {
  @apply inline-flex items-center gap-2;
}
</style>
