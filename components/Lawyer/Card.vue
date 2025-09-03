<template>
  <div
    class="laywer-card primary-box"
    :class="{
      'border border-gray-200': isEmpty,
    }"
  >
    <div v-if="isEmpty" class="overlay">
      <div class="flex items-center gap-2">
        <UIcon
          name="hugeicons:information-diamond"
          class="align-middle size-6!"
        />
        <h1 class="font-bold text-lg">وکیلی یافت نشد</h1>
      </div>
    </div>

    <LawyerProfile
      :avatar="
        lawyerInfo.lawyer_info.profile_image
          ? `${useRuntimeConfig().public.imageBase}${
              lawyerInfo.lawyer_info.profile_image
            }`
          : '/images/null-avatar.png'
      "
      :fullname="`${lawyerInfo.lawyer_info.name} ${lawyerInfo.lawyer_info.family}`"
      :education="lawyerInfo.base"
      :experience="lawyerInfo.years_of_experience || 0"
      :show="true"
      :active="lawyerInfo.is_active"
      :ui="{
        base: 'items-start! w-full!',
        avatar: 'size-14! lg:size-16!',
        name: 'justify-between!',
      }"
    >
      <template #badges>
        <UICBadge
          variant="yellow"
          icon-size="size-4! lg:size-5!"
          :value="Number(lawyerInfo.average_rating).toFixed(1)"
          icon="ic:round-star"
        />
      </template>
    </LawyerProfile>
    <div class="flex gap-2 flex-row justify-between items-center">
      <div class="flex gap-2">
        <UICBadge
          v-if="lawyerInfo.lawyer_info.is_in_person_enabled"
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="حضوری"
          icon="hugeicons:building-06"
        />
        <UICBadge
          v-if="lawyerInfo.lawyer_info.is_phone_enabled"
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="تلفنی"
          icon="hugeicons:telephone"
        />
        <UICBadge
          v-if="lawyerInfo.lawyer_info.is_chat_enabled"
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="چت"
          icon="hugeicons:message-multiple-02"
        />
      </div>
      <div class="flex items-center gap-0.5 text-primary">
        {{ titlebtn }}
        <UIcon name="proicons:chevron-left" />
      </div>
    </div>
  </div>
</template>
<script setup>
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
.laywer-card {
  @apply p-4 space-y-3  overflow-hidden relative;
}
.overlay {
  @apply w-full h-full flex items-center justify-center absolute top-0 start-0 backdrop-blur-xs z-50 bg-white/30 text-black;
}
</style>
