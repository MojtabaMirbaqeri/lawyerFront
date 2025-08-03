<template>
  <ThingSeparator
    data-sidebar="separator"
    :class="sideBarSeparatorStyles({ class: props.class })"
  >
    <slot />
  </ThingSeparator>
</template>

<script lang="ts">
import type { HTMLAttributes } from "vue";
import { tv } from 'tailwind-variants';


export const sideBarSeparatorStyles = tv({
  base: "mx-2 w-auto bg-sidebar-border",
});
</script>

<script setup lang="ts">
const props = defineProps<{
  /**
   * Additional classes to apply to the parent element.
   */
  class?: HTMLAttributes["class"];
}>();
</script>
