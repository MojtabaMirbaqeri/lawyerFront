<template>
  <span class="back text-[#1e3a5f]" @click="handleClick()">
    <UIcon name="proicons:chevron-right" class="size-5! lg:size-4!" />
    <span class="hidden lg:block">بازگشت</span>
  </span>
</template>
<script setup>
const registerStore = useRegisterStore();

const handleClick = () => {
  registerStore.prevStep();
};
</script>
<style scoped>
@reference "tailwindcss";

.back {
  @apply flex items-center text-sm gap-1 cursor-pointer p-2 lg:px-0 lg:w-20;
}
</style>