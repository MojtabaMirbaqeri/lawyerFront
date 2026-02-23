<template>
  <div class="flex flex-wrap justify-start items-start gap-x-2 gap-y-3">
    <button
      v-for="item in items"
      :key="item.id"
      :class="getButtonClass(item)"
      :disabled="item.disabled || item.nonworking"
      @click="handleClick(item.id)"
    >
      <UIcon
        v-if="item.icon"
        :name="item.icon"
        :class="[mergedThing.icon, item.iconClass]"
      />
      {{ item.title }}
    </button>
  </div>
</template>

<script setup>
import { twMerge } from "tailwind-merge";

const modelValue = defineModel({ type: [String, Array, Number] });

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
  clearable: {
    type: Boolean,
    default: false,
  },
});

const defaultThing = {
  base: "px-4 py-2 rounded-full border border-gray-300 text-sm lg:text-base transition cursor-pointer",
  active: "bg-amber-500! border-transparent! text-gray-900!",
  disabled:
    "bg-gray-100 opacity-60 text-gray-500 border-gray-200 cursor-not-allowed",
  nonworking: "bg-yellow-50 text-yellow-700 border-yellow-300",
  icon: "size-4!",
};

const mergedThing = {
  base: twMerge(defaultThing.base, props.ui.base),
  active: twMerge(defaultThing.active, props.ui.active),
  disabled: twMerge(defaultThing.disabled, props.ui.disabled),
  nonworking: twMerge(defaultThing.nonworking, props.ui.nonworking),
  icon: twMerge(defaultThing.icon, props.ui.icon),
};

const isSelected = (id) => {
  return props.multiple
    ? Array.isArray(modelValue.value) && modelValue.value.includes(id)
    : modelValue.value === id;
};

// Single deterministic class string to avoid SSR/client hydration mismatch (order and selected state)
function getButtonClass(item) {
  return twMerge(
    mergedThing.base,
    "flex items-center gap-1",
    isSelected(item.id) ? mergedThing.active : "",
    item.disabled ? mergedThing.disabled : "",
    item.nonworking ? mergedThing.nonworking : ""
  );
}

const handleClick = (id) => {
  if (props.multiple) {
    const current = Array.isArray(modelValue.value)
      ? [...modelValue.value]
      : [];
    const index = current.indexOf(id);

    if (index >= 0) {
      // اگر clearable هست، آیتم رو حذف می‌کنیم
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    modelValue.value = current;
  } else {
    if (props.clearable && modelValue.value === id) {
      // اگر clearable باشه و آیتم انتخاب شده دوباره کلیک شد => پاک کن
      modelValue.value = null;
    } else {
      modelValue.value = id;
    }
  }
};
</script>
