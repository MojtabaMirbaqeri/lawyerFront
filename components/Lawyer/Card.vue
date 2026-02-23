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
      <div class="avatar-block">
        <div class="avatar-wrapper">
          <!-- <UChip
            inset
            :show="lawyerInfo?.lawyer_info?.is_active"
            position="bottom-right"
            :ui="{ base: 'bg-green-500 size-3.5 ring-2 ring-white right-[8%]' }"> -->
            <UAvatar
              class="size-full"
              :src="lawyerInfo?.profile_image ? config.public.imageBase + lawyerInfo.profile_image : '/images/nullavatar.png'"
              :alt="`${lawyerInfo?.name} ${lawyerInfo?.family}`"
              :ui="{ image: 'object-[50%_0%]' }" />
          <!-- </UChip> -->
        </div>
        <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 verified-badge w-[85px] px-[8px] py-[4px] flex flex-row items-center justify-center gap-[8px] rounded-[26px] z-10 text-white">
          <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0 mb-[1px]">
            <path d="M4.14545 11L3.10909 9.32381L1.14545 8.90476L1.33636 6.96667L0 5.5L1.33636 4.03333L1.14545 2.09524L3.10909 1.67619L4.14545 0L6 0.759524L7.85455 0L8.89091 1.67619L10.8545 2.09524L10.6636 4.03333L12 5.5L10.6636 6.96667L10.8545 8.90476L8.89091 9.32381L7.85455 11L6 10.2405L4.14545 11ZM5.42727 7.35952L8.50909 4.4L7.74545 3.64048L5.42727 5.86667L4.25455 4.76667L3.49091 5.5L5.42727 7.35952Z" fill="white"/>
          </svg>
          <span class="text-[12px] font-bold whitespace-nowrap leading-none mt-0.5">تایید شده</span>
        </div>
      </div>
      
      <!-- Rating Badge -->
      <div class="rating-badge">
        <UIcon name="heroicons:star-solid" class="size-4!" />
        <span class="text-xs">{{ Number(lawyerInfo?.average_rating || 0).toFixed(1) }}</span>
      </div>

      <!-- Online Badge -->
      <div class="online-badge">
        <span class="online-badge-dot" aria-hidden="true" />
        <span class="text-xs">آنلاین</span>
      </div>
    </div>

    <!-- Lawyer Info -->
    <div class="lawyer-info">
      <h3 class="lawyer-name text-lg">{{ lawyerInfo?.name }} {{ lawyerInfo?.family }}</h3>
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

.avatar-block {
  @apply relative shrink-0 size-20 lg:size-24;
}

.avatar-wrapper {
  @apply size-full rounded-full overflow-hidden border-2 border-[#1E3A5F];
  padding: 0;
}

.verified-badge {
  background: linear-gradient(90deg, #0048FF 0%, #002279 100%);
}

.avatar-wrapper :deep(.relative) {
  @apply rounded-full overflow-hidden ring-0 border-0 bg-transparent;
  box-shadow: none;
}

.rating-badge {
  @apply absolute top-0 end-0 flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
}

.online-badge {
  @apply absolute top-0 start-0 flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold text-white;
  background: linear-gradient(90deg, #00ff37 0%, #10a630 100%);
}

.online-badge-dot {
  @apply size-2 rounded-full bg-white shrink-0;
}

.lawyer-info {
  @apply mb-4;
}

.lawyer-name {
  @apply text-lg lg:text-lg font-bold text-gray-800 mb-1;
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
