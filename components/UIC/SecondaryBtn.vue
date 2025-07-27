<template>
  <button
    :disabled="disabled"
    :class="{
      'bg-gray-400! cursor-no-drop!': disabled,
    }"
  >
    <slot />
  </button>
</template>
<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
  <style scoped>
@reference "tailwindcss";
button {
  @apply text-sm py-2 px-4 rounded-full bg-blue-400 text-white cursor-pointer hover:opacity-80 transition duration-300 text-center;
  @apply flex items-center gap-1.5 justify-center;
}
</style>