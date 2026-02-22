<template>
  <div
    class="lawyer-card"
    :class="{ 'lawyer-card--empty': isEmpty }">
    
    <!-- Empty State Overlay -->
    <div v-if="isEmpty" class="empty-overlay">
      <UIcon name="heroicons:magnifying-glass-solid" class="size-8! text-gray-400" />
      <h3 class="text-lg font-bold text-gray-600">وکیلی یافت نشد</h3>
      <p class="text-sm text-gray-400">با تغییر فیلترها دوباره جستجو کنید</p>
    </div>

    <!-- Card Content -->
    <div class="card-header">
      <!-- Avatar -->
      <div class="avatar-wrapper">
        <!-- <UChip
          inset
          :show="lawyerInfo?.lawyer_info?.is_active"
          position="bottom-right"
          :ui="{ base: 'bg-green-500 size-3.5 ring-2 ring-white right-[8%]' }"> -->
          <UAvatar
            class="size-full"
            :src="lawyerInfo?.profile_image ? useStorageImageUrl(lawyerInfo.profile_image) : '/images/nullavatar.png'"
            :alt="`${lawyerInfo?.name} ${lawyerInfo?.family}`"
            :ui="{ image: 'object-[50%_0%]' }" />
        <!-- </UChip> -->
      </div>
      
      <!-- Rating Badge -->
      <div class="rating-badge">
        <UIcon name="heroicons:star-solid" class="size-4!" />
        <span>{{ Number(lawyerInfo?.average_rating || 0).toFixed(1) }}</span>
      </div>
    </div>

    <!-- Lawyer Info -->
    <div class="lawyer-info">
      <h3 class="lawyer-name">{{ lawyerInfo?.name }} {{ lawyerInfo?.family }}</h3>
      <p class="lawyer-title">{{ lawyerInfo?.base || 'وکیل دادگستری' }}</p>
      
      <!-- Location -->
      <div class="lawyer-location">
        <UIcon name="heroicons:map-pin-solid" class="size-4!" />
        <span>{{ lawyerInfo?.city || lawyerInfo?.province || 'ایران' }}</span>
      </div>
    </div>

    <!-- Consultation Types -->
    <div class="consult-types">
      <div v-if="lawyerInfo?.lawyer_info?.is_chat_enabled" class="consult-badge consult-badge--chat">
        <UIcon name="heroicons:chat-bubble-left-right-solid" class="size-4!" />
        چت
      </div>
      <div v-if="lawyerInfo?.lawyer_info?.is_phone_enabled" class="consult-badge consult-badge--phone">
        <UIcon name="heroicons:phone-solid" class="size-4!" />
        تلفنی
      </div>
      <div v-if="lawyerInfo?.lawyer_info?.is_in_person_enabled" class="consult-badge consult-badge--inperson">
        <UIcon name="heroicons:building-office-2-solid" class="size-4!" />
        حضوری
      </div>
    </div>

    <!-- Action Button -->
    <button class="book-btn">
      <span>{{ titlebtn || 'رزرو مشاوره' }}</span>
      <UIcon name="heroicons:arrow-left-solid" class="size-4!" />
    </button>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

defineProps({
  lawyerInfo: {
    type: Object,
    required: true,
  },
  isEmpty: {
    type: Boolean,
    default: false,
  },
  titlebtn: {
    type: String,
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.lawyer-card {
  @apply bg-white rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.lawyer-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.lawyer-card--empty {
  @apply border-2 border-dashed border-gray-200;
}

.empty-overlay {
  @apply absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/90 z-10;
  backdrop-filter: blur(4px);
}

.card-header {
  @apply relative w-full flex justify-center mb-4;
}

.avatar-wrapper {
  @apply size-20 lg:size-24 rounded-full overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  padding: 3px;
}

.avatar-wrapper :deep(.relative) {
  @apply rounded-full overflow-hidden;
}

.rating-badge {
  @apply absolute top-0 end-0 flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
}

.lawyer-info {
  @apply mb-4;
}

.lawyer-name {
  @apply text-lg lg:text-xl font-bold text-gray-800 mb-1;
}

.lawyer-title {
  @apply text-sm text-gray-500 mb-2;
}

.lawyer-location {
  @apply flex items-center justify-center gap-1 text-sm text-gray-400;
}

.consult-types {
  @apply flex flex-wrap justify-center gap-2 mb-4;
}

.consult-badge {
  @apply flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium;
}

.consult-badge--chat {
  @apply bg-green-50 text-green-600;
}

.consult-badge--phone {
  @apply text-[#1e3a5f];
  background-color: rgba(30, 58, 95, 0.1);
}

.consult-badge--inperson {
  @apply bg-orange-50 text-orange-600;
}

.book-btn {
  @apply w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white;
  background: #1e3a5f;
  box-shadow: 0 4px 15px rgba(30, 58, 95, 0.35);
  transition: all 0.3s ease;
}

.book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.45);
  background: #2d5a87;
}
</style>
