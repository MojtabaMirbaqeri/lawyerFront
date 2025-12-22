<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="flex items-center gap-1.5">
      <!-- دقیقه -->
      <div class="w-20">
        <UICSelect
          :model-value="minuteValue"
          :items="minutes"
          :disabled="disabled"
          placeholder="دقیقه"
          @update:model-value="updateMinute" />
      </div>

      <span class="text-lg font-bold text-gray-400 px-0.5">:</span>

      <!-- ساعت -->
      <div class="w-20">
        <UICSelect
          :model-value="hourValue"
          :items="hours"
          :disabled="disabled"
          placeholder="ساعت"
          @update:model-value="updateHour" />
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
