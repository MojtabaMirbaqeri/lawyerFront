<template>
  <button
    type="button"
    class="flex items-center gap-1.5 text-sm text-[#1e3a5f] hover:text-[#152a45] transition-colors p-2 -m-2 rounded-lg hover:bg-slate-100/80"
    @click="handleClick"
  >
    <UIcon name="solar:arrow-right-linear" class="size-5" />
    <span class="hidden sm:inline">بازگشت</span>
  </button>
</template>

<script setup>
const registerStore = useRegisterStore();

const handleClick = () => {
  registerStore.prevStep();
};
</script>
