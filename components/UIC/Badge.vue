<template>
  <UBadge :icon="icon" :ui="{ leadingIcon: iconSize }" :class="badgeClass">
    <span>{{ value }}</span>
  </UBadge>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: [String, Number],
  customClass: String,
  icon: String,
  iconSize: String,
  variant: {
    type: String,
    default: null,
  },
});

const variantClasses = {
  yellow: "text-[#feb900] bg-[#fff9e7]",
  blue: "text-blue-500 bg-blue-100",
  gray: "text-black !bg-gray-100",
  red: "text-red-500 !bg-red-100",
  green: "text-green-500 !bg-green-100",
};

const baseClass = "font-bold w-fit flex items-center rounded-full";

const badgeClass = computed(() => {
  const variant = props.variant || "blue";
  const variantClass = variantClasses[variant] || "";
  const custom = props.customClass || "";
  return `${baseClass} ${variantClass} ${custom}`.trim();
});
</script>
