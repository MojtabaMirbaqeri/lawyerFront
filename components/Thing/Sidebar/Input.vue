<template>
  <ThingInput
    v-model="model"
    data-sidebar="input"
    :class="sideBarInputStyles({ class: props.class })"
  >
    <slot />
  </ThingInput>
</template>

<script lang="ts">
import type { HTMLAttributes } from "vue";
import { tv } from "tailwind-variants";

export const sideBarInputStyles = tv({
  base: "h-8 w-full border-sidebar-input bg-sidebar shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
});
</script>
<script setup lang="ts">
const props = defineProps<{
  /**
   * Additional classes to apply to the parent element.
   */
  class?: HTMLAttributes["class"];
}>();

const model = defineModel<any>();
</script>
