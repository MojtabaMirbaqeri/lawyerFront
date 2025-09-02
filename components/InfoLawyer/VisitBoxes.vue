<template>
  <div
    class="flex flex-col w-full flex-wrap justify-start items-start gap-x-2 gap-y-3"
  >
    <button
      v-for="item in items"
      :key="item.id"
      :disabled="!item.active"
      :class="[baseClass, modelValue === item.id ? activeClass : '' , !item.active ? 'disable' : '',]"
      @click="() => (modelValue = item.id)"
      class="w-full"
    >
      <div class="w-full items-center flex gap-3">
        <div class="">
          <UIcon :name="item.icon" class="size-6!" />
        </div>
        <div class="title-price text-base w-full flex justify-between">
          <div class="title">{{ item.title }}</div>
          <div class="price">{{ item.price }} تومان</div>
        </div>
      </div>
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
      "px-4 py-2 rounded-[10px] border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  },
  activeClass: {
    type: String,
    default: "bg-primary/10! border-primary!",
  },
});
</script>

<style scoped>
@reference "tailwindcss";

.disable {
  @apply bg-gray-100 opacity-60;
  color: #666;
  border-color: #ccd;
  cursor: not-allowed;
}
</style>