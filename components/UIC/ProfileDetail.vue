<template>
  <div class="lawyer-detail hidden lg:block primary-box">
    <div class="top flex flex-col items-center">
      <div class="avatar max-w-[60px] mb-2">
        <NuxtImg :src="src" alt="" />
      </div>
      <div class="fullname font-semibold">جناب آقای {{ fullname }}</div>
      <div class="skill opacity-60 text-xs">{{ skill }}</div>
    </div>
    <div class="bottom flex flex-col gap-3">
      <USeparator class="mt-2" />
      <div class="pay-date flex justify-between">
        <div class="payment-type">{{ paymentType }}</div>
        <div class="date-time">
          {{ new Date(activeDay).toLocaleDateString("fa") }}
        </div>
      </div>
      <div class="button">
        <UICSecondaryBtn
          @click="han"
          class="rounded-[8px]! justify-center! w-full"
          :class="{
            'bg-transparent! border border-red-500 text-red-500!': step === 2,
          }"
        >
          <span class="text-center text-base">
            {{ step === 1 ? "ادامه" : "بازگشت" }}
          </span>
        </UICSecondaryBtn>
      </div>
    </div>
  </div>
  <div class="sidebar-btn" v-if="step === 1">
    <UICSecondaryBtn
      @click="han"
      class="rounded-[8px]! justify-center! w-full"
      :class="{
        'bg-transparent! border border-red-500 text-red-500!': step === 2,
      }"
    >
      <span class="text-center text-base">
        {{ step === 1 ? "ادامه" : "بازگشت" }}
      </span>
    </UICSecondaryBtn>
  </div>
</template>

<script setup>
defineProps(["src", "fullname", "skill", "paymentType", "activeDay"]);
const step = defineModel({ type: Number });

const han = () => {
  if (step.value === 1) {
    step.value++;
  } else {
    step.value--;
  }
};
</script>

<style scoped>
@reference "tailwindcss";

.sidebar-btn {
  @apply fixed lg:shadow-none lg:z-0 shadow-[0_35px_35px_20px_rgba(0,0,0,0.25)] gap-6 rounded-t-[14px] lg:hidden bottom-0 right-0 mx-auto lg:mx-0 bg-white p-4 z-50 left-0 flex flex-col;
}
</style>