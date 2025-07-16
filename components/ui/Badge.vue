<template>
  <UBadge :icon="icon" :ui="{ leadingIcon: iconSize }" :class="badgeClass">
    <span class="text-[14px]">{{ value }}</span>
  </UBadge>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: [String,Number],
  customClass: String,
  icon: String,
  iconSize: String,
  variant: {
    type: String,
    default: null,
  },
});

// تعریف کلاس‌های آماده برای variants
const variantClasses = {
  yellow: "text-[#feb900] bg-[#fff9e7]",
  blue: "text-blue-500 bg-blue-100",
  gray: "text-black !bg-gray-100",
};

// کلاس پایه مشترک
const baseClass = "font-bold w-fit flex items-center rounded-full";

// محاسبه کلاس نهایی
const badgeClass = computed(() => {
  if (props.customClass) return `${baseClass} ${props.customClass}`;

  const variant = props.variant || "blue";
  return `${baseClass} ${variantClasses[variant] || ""}`;
});
</script>
