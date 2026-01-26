<template>
  <button
    :disabled="disabled"
    :class="[
      baseClasses,
      variantClasses,
      { 'bg-gray-400! cursor-no-drop!': disabled },
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "default",
  },
});

const baseClasses =
  "secondary-btn text-sm py-2 px-4 rounded-full cursor-pointer hover:opacity-80 transition duration-300 text-center flex items-center gap-1.5 justify-center";

const variantClasses = computed(() => {
  switch (props.variant) {
    case "red":
      return "bg-transparent! border border-red-500 text-red-500!";
    default:
      return "bg-[#1e3a5f] text-white";
  }
});
</script>

<style scoped>
@reference "tailwindcss";
</style>
