<template>
  <div class="flex flex-wrap justify-start items-start gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex items-center gap-1"
      :class="
        twMerge(
          mergedUi.base,
          isSelected(item.id) && mergedUi.active,
          item.disabled && mergedUi.disabled,
          item.nonworking && mergedUi.nonworking
        )
      "
      :disabled="item.disabled || item.nonworking"
      @click="handleClick(item.id)"
    >
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        :class="[mergedUi.icon, item.iconClass]"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script setup>
import { twMerge } from "tailwind-merge";

const modelValue = defineModel({ type: [String, Array] });

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  ui: {
    type: Object,
    default: () => ({}),
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});

// پیش‌فرض‌ها
const defaultUi = {
  base: "px-4 py-2 rounded-full border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  active: "bg-primary! border-transparent! text-white!",
  disabled:
    "bg-gray-100 opacity-60 text-gray-500 border-gray-200 cursor-not-allowed",
  nonworking: "bg-yellow-50 text-yellow-700 border-yellow-300",
  icon: "size-4!",
};

// مرج با props.ui
const mergedUi = {
  base: twMerge(defaultUi.base, props.ui.base),
  active: twMerge(defaultUi.active, props.ui.active),
  disabled: twMerge(defaultUi.disabled, props.ui.disabled),
  nonworking: twMerge(defaultUi.nonworking, props.ui.nonworking),
  icon: twMerge(defaultUi.icon, props.ui.icon),
};

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
