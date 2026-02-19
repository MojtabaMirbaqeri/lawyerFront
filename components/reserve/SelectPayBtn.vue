<template>
  <div class="flex flex-wrap justify-start items-start gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-1"
      :class="[
        baseClass,
        isSelected(item.id) ? activeClass : '',
        item.disabled ? 'disable' : '',
        item.nonworking ? 'nonworking' : '',
      ]"
      :disabled="item.disabled || item.nonworking"
      @click="handleClick(item.id)"
    >
      <NuxtImg
        v-if="item.src"
        :src="'/images/' + item.src"
        width="24"
        height="24"
        loading="lazy"
        class="size-6"
        alt="دروازه پرداخت"
      />
      <div class="flex flex-col">
        <span class="lg:text-[18px]">
          {{ item.title }}
        </span>
        <span class="text-xs lg:text-sm"> کلیه کارت های عضو شتاب </span>
      </div>
    </button>
  </div>
</template>

<script setup>
const modelValue = defineModel({ type: [String, Array] });

const props = defineProps({
  items: {
    type: Array,
    required: true,
    //  { title: string, id: any, icon?: string }
  },
  baseClass: {
    type: String,
    default:
      "px-4 py-2 w-full rounded-[8px] text-right gap-4 border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  },
  activeClass: {
    type: String,
    default: "border-primary!",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

// console.log(items);

const isSelected = (id) => {
  return props.multiple
    ? Array.isArray(modelValue.value) && modelValue.value.includes(id)
    : modelValue.value === id;
};
const handleClick = (id) => {
  if (props.multiple) {
    const current = Array.isArray(modelValue.value)
      ? [...modelValue.value]
      : [];
    const index = current.indexOf(id);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    modelValue.value = current;
  } else {
    modelValue.value = id;
  }
};
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