<template>
  <Primitive
    :class="styles({ loading, class: props.class })"
    v-bind="forwarded"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from "radix-vue";
import type { PrimitiveProps } from "radix-vue";
import { tv } from "tailwind-variants";
import { reactiveOmit } from "@vueuse/core";

const styles = tv({
  base: "animate-pulse rounded-md bg-muted",
  variants: {
    loading: { true: "cursor-wait", false: "cursor-default" },
  },
});

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** Custom class(es) to add to parent element */
      class?: any;
      /** Whether the skeleton is loading */
      loading?: boolean;
    }
  >(),
  {
    as: "div",
  }
);

const forwarded = reactiveOmit(props, "class", "loading");
</script>
