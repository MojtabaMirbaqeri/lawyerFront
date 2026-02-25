<template>
  <div class="profile-completion-header">
    <!-- Main Header -->
    <div class="completion-main">
      <div class="completion-info">
        <div class="completion-icon" :class="completionClass">
          <Icon :name="completionIcon" class="w-8 h-8" />
        </div>
        <div class="completion-text">
          <h2 class="completion-title">تکمیل پروفایل</h2>
          <p class="completion-subtitle">
            {{ isComplete ? 'پروفایل شما کامل است و آماده دریافت موکل هستید' : 'برای فعال‌سازی رزرو، پروفایل خود را تکمیل کنید' }}
          </p>
        </div>
      </div>
      
      <div class="completion-stats">
        <div class="completion-percentage">
          <span class="percentage-value">{{ completionPercentage }}%</span>
          <span class="percentage-label">تکمیل شده</span>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="completion-progress">
      <div class="progress-bar h-2.5!">
        <div 
          class="progress-bar-fill" 
          :class="{ 'success': completionPercentage >= 100 }"
          :style="{ width: `${completionPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Checklist -->
    <div class="completion-checklist">
      <div 
        v-for="item in checklistItems" 
        :key="item.id" 
        class="checklist-item"
        :class="{ 'completed': item.status === 'completed', 'pending': item.status === 'pending', 'incomplete': item.status === 'incomplete' }"
        @click="$emit('navigate', item.id)"
      >
        <div class="checklist-icon">
          <Icon v-if="item.status === 'completed'" name="lucide:check-circle" class="w-5 h-5" />
          <Icon v-else-if="item.status === 'pending'" name="lucide:clock" class="w-5 h-5" />
          <Icon v-else name="lucide:circle" class="w-5 h-5" />
        </div>
        <div class="checklist-content">
          <span class="checklist-label">{{ item.label }}</span>
          <span v-if="item.hint" class="checklist-hint">{{ item.hint }}</span>
        </div>
        <!-- <div class="checklist-weight">{{ item.weight }}%</div> -->
      </div>
    </div>

    <!-- CTA Button -->
    <div v-if="!isComplete && nextIncompleteSection" class="completion-cta">
      <button @click="$emit('navigate', nextIncompleteSection.id)" class="btn-primary">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        {{ nextIncompleteSection.cta || `تکمیل ${nextIncompleteSection.label}` }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lawyerInfo: { type: Object, required: true },
  kycStatus: { type: String, default: 'not_submitted' }, // not_submitted, pending, approved, rejected
  hasEducation: { type: Boolean, default: false },
  hasWorkplace: { type: Boolean, default: false },
  hasSchedule: { type: Boolean, default: false },
  hasPricing: { type: Boolean, default: false },
});

const emit = defineEmits(['navigate']);

// منطق یکسان با داشبورد از طریق composable
const input = computed(() => ({
  lawyerInfo: props.lawyerInfo,
  kycStatus: props.kycStatus,
  hasEducation: props.hasEducation,
  hasWorkplace: props.hasWorkplace,
  hasSchedule: props.hasSchedule,
  hasPricing: props.hasPricing,
}));
const { checklistItems, completionPercentage, isComplete, nextIncompleteSection } =
  useProfileCompletion(input);

const completionClass = computed(() => {
  if (completionPercentage.value >= 100) return 'complete';
  if (completionPercentage.value >= 50) return 'partial';
  return 'low';
});

const completionIcon = computed(() => {
  if (completionPercentage.value >= 100) return 'lucide:check-circle-2';
  if (completionPercentage.value >= 50) return 'lucide:circle-dashed';
  return 'lucide:alert-circle';
});

</script>

<style scoped>
@reference "tailwindcss";

.profile-completion-header {
  @apply bg-white rounded-xl border border-gray-100 p-6 mb-6;
  box-shadow: var(--shadow-sm);
}

/* Main Header */
.completion-main {
  @apply flex items-center justify-between gap-4 mb-4;
}

.completion-info {
  @apply flex items-center gap-4;
}

.completion-icon {
  @apply w-14 h-14 rounded-xl flex items-center justify-center;
}

.completion-icon.complete {
  @apply bg-green-100 text-green-600;
}

.completion-icon.partial {
  @apply bg-amber-100 text-amber-600;
}

.completion-icon.low {
  @apply bg-red-100 text-red-600;
}

.completion-text {
  @apply flex flex-col;
}

.completion-title {
  @apply text-lg font-bold text-gray-900;
}

.completion-subtitle {
  @apply text-sm text-gray-500;
}

.completion-stats {
  @apply flex items-center gap-4;
}

.completion-percentage {
  @apply flex flex-col items-center;
}

.percentage-value {
  @apply text-3xl font-bold text-gray-900;
}

.percentage-label {
  @apply text-xs text-gray-500;
}

/* Progress Bar */
.completion-progress {
  @apply mb-5;
}

/* Checklist */
.completion-checklist {
  @apply grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4;
}

.checklist-item {
  @apply flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all;
}

.checklist-item.completed {
  @apply bg-green-50 border-green-200;
}

.checklist-item.completed .checklist-icon {
  @apply text-green-600;
}

.checklist-item.pending {
  @apply bg-amber-50 border-amber-200;
}

.checklist-item.pending .checklist-icon {
  @apply text-amber-600;
}

.checklist-item.incomplete {
  @apply bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50;
}

.checklist-item.incomplete .checklist-icon {
  @apply text-gray-400;
}

.checklist-content {
  @apply flex-1 min-w-0;
}

.checklist-label {
  @apply block text-sm font-medium text-gray-900;
}

.checklist-hint {
  @apply block text-xs text-gray-500 truncate;
}

.checklist-weight {
  @apply text-xs font-medium text-gray-400;
}

/* CTA */
.completion-cta {
  @apply pt-4 border-t border-gray-100;
}

.completion-cta .btn-primary {
  @apply inline-flex items-center gap-2;
}

@media (max-width: 768px) {
  .completion-main {
    @apply flex-col items-start;
  }
  
  .completion-checklist {
    @apply grid-cols-1;
  }
}
</style>
