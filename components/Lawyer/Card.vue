<template>
  <div class="laywer-card primary-box">
    <LawyerProfile
      avatar="/images/lawyerpic.png"
      fullname="محمد امین زاده"
      education="وکیل پایه یک دادگستری"
      experience="7"
      :show="true"
      :active="true"
      :ui="{
        base: 'items-start! w-full!',
        avatar: 'max-w-14! lg:max-w-16!',
        name: 'justify-between!',
      }"
    >
      <template #badges>
        <UIBadge
          class="text-[#feb900] bg-[#fff9e7]"
          icon-size="size-5!"
          :value="4.8"
          icon="ic:round-star"
        />
      </template>
    </LawyerProfile>
    <div class="flex flex-col sm:flex-row justify-between">
      <div class="flex gap-2">
        <UIBadge
          class="text-black! bg-gray-100! font-semibold"
          value="حضوری"
          icon="hugeicons:building-06"
        />
        <UIBadge
          class="text-black! bg-gray-100! font-semibold"
          value="تلفنی"
          icon="hugeicons:telephone"
        />
        <UIBadge
          class="text-black! bg-gray-100! font-semibold"
          value="متنی"
          icon="hugeicons:message-multiple-02"
        />
      </div>
      <div class="flex items-center gap-0.5 text-primary self-end">
        رزرو مشاوره
        <UIcon name="proicons:chevron-left" />
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference "tailwindcss";
.laywer-card {
  @apply p-4 space-y-3;
}
</style>
