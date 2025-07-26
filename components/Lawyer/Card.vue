<template>
  <div class="laywer-card primary-box">
    <LawyerProfile
      :avatar="lawyerInfo.profile_image || '/images/null-avatar.png'"
      :fullname="`${lawyerInfo.lawyer_info.name} ${lawyerInfo.lawyer_info.family}`"
      :education="lawyerInfo.base"
      :experience="lawyerInfo.years_of_experience || 0"
      :show="true"
      :active="lawyerInfo.is_active"
      :ui="{
        base: 'items-start! w-full!',
        avatar: 'max-w-14! lg:max-w-16!',
        name: 'justify-between!',
      }"
    >
      <template #badges>
        <UICBadge
          variant="yellow"
          icon-size="size-4! lg:size-5!"
          :value="4.8"
          icon="ic:round-star"
        />
      </template>
    </LawyerProfile>
    <div class="flex gap-2 flex-row justify-between items-center">
      <div class="flex gap-2">
        <UICBadge
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="حضوری"
          icon="hugeicons:building-06"
        />
        <UICBadge
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="تلفنی"
          icon="hugeicons:telephone"
        />
        <UICBadge
          custom-class="font-semibold text-[11px] lg:text-xs"
          variant="gray"
          value="چت"
          icon="hugeicons:message-multiple-02"
        />
      </div>
      <div class="flex items-center gap-0.5 text-primary">
        رزرو مشاوره
        <UIcon name="proicons:chevron-left" />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ lawyerInfo: Object });
</script>
<style scoped>
@reference "tailwindcss";
.laywer-card {
  @apply p-4 space-y-3;
}
</style>
