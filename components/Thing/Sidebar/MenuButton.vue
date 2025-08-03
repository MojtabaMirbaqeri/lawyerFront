<template>
  <ThingSidebarMenuButtonChild
    v-if="!tooltip"
    v-bind="{ ...delegatedProps, ...$attrs }"
  >
    <slot />
  </ThingSidebarMenuButtonChild>

  <ThingTooltip v-else>
    <ThingTooltipTrigger as-child>
      <ThingSidebarMenuButtonChild v-bind="{ ...delegatedProps, ...$attrs }">
        <slot />
      </ThingSidebarMenuButtonChild>
    </ThingTooltipTrigger>
    <ThingTooltipContent
      side="right"
      align="center"
      :hidden="state !== 'collapsed' || isMobile"
    >
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </ThingTooltipContent>
  </ThingTooltip>
</template>

<script lang="ts">
import type { SidebarMenuButtonProps } from "./MenuButtonChild.vue";
import type { Component } from "vue";
</script>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<
    SidebarMenuButtonProps & {
      tooltip?: string | Component;
    }
  >(),
  {
    as: "button",
    variant: "default",
    size: "default",
  }
);

const { isMobile, state } = useSidebar();

const delegatedProps = computed(() => {
  const { tooltip, ...delegated } = props;
  return delegated;
});
</script>
