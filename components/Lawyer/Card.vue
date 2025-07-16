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
          variant="yellow"
          icon-size="size-5!"
          :value="4.8"
          icon="ic:round-star"
        />
      </template>
    </LawyerProfile>
    <div class="flex flex-col gap-2 sm:flex-row justify-between">
      <div class="flex gap-2">
        <UIBadge
          custom-class="font-semibold"
          variant="gray"
          value="حضوری"
          icon="hugeicons:building-06"
        />
        <UIBadge
          custom-class="font-semibold"
          variant="gray"
          value="تلفنی"
          icon="hugeicons:telephone"
        />
        <UIBadge
          custom-class="font-semibold"
          variant="gray"
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
