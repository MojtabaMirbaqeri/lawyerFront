<template>
  <UPopover
    mode="hover"
    :open-delay="150"
    :close-delay="100"
    :content="{ side: 'top', sideOffset: 8 }">
    <span
      :class="`cursor-pointer select-none inline-block truncate max-w-[${maxLength}ch]`">
      {{ truncated }}
    </span>

    <template #content>
      <div class="max-w-xs p-2 text-sm leading-relaxed break-words">
        {{ text || "-" }}
      </div>
    </template>
  </UPopover>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    default: 20,
  },
});

const truncated = computed(() =>
  props.text?.length > props.maxLength
    ? props.text.slice(0, props.maxLength) + "…"
    : props.text
);
</script>
