<template>
  <div class="ui-time-picker space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="time-picker-row flex items-end gap-2">
      <!-- ساعت (در RTL سمت راست نمایش داده می‌شود) -->
      <div class="time-part flex flex-col gap-1">
        <span class="time-part-label text-xs font-medium text-gray-500">ساعت</span>
        <UICSelect
          :model-value="hourValue"
          :items="hours"
          :disabled="disabled"
          placeholder="۰۰"
          @update:model-value="updateHour" />
      </div>
      <span class="time-separator text-lg font-bold text-gray-400 pb-1" aria-hidden="true">:</span>
      <!-- دقیقه -->
      <div class="time-part flex flex-col gap-1">
        <span class="time-part-label text-xs font-medium text-gray-500">دقیقه</span>
        <UICSelect
          :model-value="minuteValue"
          :items="minutes"
          :disabled="disabled"
          placeholder="۰۰"
          @update:model-value="updateMinute" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// لیست ساعت‌ها (00-23)
const hours = computed(() => {
  return Array.from({ length: 24 }, (_, i) => ({
    id: String(i).padStart(2, "0"),
    label: String(i).padStart(2, "0"),
  }));
});

// لیست دقیقه‌ها (00-59)
const minutes = computed(() => {
  return Array.from({ length: 60 }, (_, i) => ({
    id: String(i).padStart(2, "0"),
    label: String(i).padStart(2, "0"),
  }));
});

// مقدار ساعت از modelValue
const hourValue = computed(() => {
  if (!props.modelValue) return "";
  const [hour] = props.modelValue.split(":");
  return hour || "";
});

// مقدار دقیقه از modelValue
const minuteValue = computed(() => {
  if (!props.modelValue) return "";
  const [, minute] = props.modelValue.split(":");
  return minute || "";
});

// آپدیت ساعت
const updateHour = (newHour) => {
  const minute = minuteValue.value || "00";
  emit("update:modelValue", `${newHour}:${minute}`);
};

// آپدیت دقیقه
const updateMinute = (newMinute) => {
  const hour = hourValue.value || "00";
  emit("update:modelValue", `${hour}:${newMinute}`);
};
</script>

<style scoped>
@reference "tailwindcss";

.time-picker-row {
  @apply flex-row;
}

.time-part {
  @apply min-w-[4.5rem];
}

.time-part-label {
  @apply block;
}
</style>
