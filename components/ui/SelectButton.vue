<template>
  <div class="flex flex-wrap justify-start items-start gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.value"
      :class="[baseClass, modelValue === item.value ? activeClass : '']"
      @click="() => (modelValue = item.value)"
    >
      <slot></slot>
    </button>
  </div>
</template>
  
  <script setup>
const modelValue = defineModel({ type: String });

defineProps({
  items: {
    type: Array,
    required: true,
  },
  baseClass: {
    type: String,
    default:
      "px-4 py-2 rounded-full border border-primary text-sm lg:text-base transition cursor-pointer",
  },
  activeClass: {
    type: String,
    default: "bg-primary! text-white!",
  },
});
</script>