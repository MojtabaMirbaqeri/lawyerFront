<template>
  <div
    v-if="collapsible === 'none'"
    :class="sideBarStyles().collapsible({ class: props.class })"
    v-bind="$attrs"
  >
    <slot />
  </div>

  <nav v-else-if="isMobile">
    <div
      :class="{ 'opacity-0! z-[-1]!': !useDashboardStore().openSidebar }"
      class="sidebar-overlay"
      @click="closeSideBar"
    ></div>
    <div
      class="mobile-sidebar z-30 h-screen w-[18rem] bg-white right-[-100%] fixed top-0"
      :class="{ 'right-0!': useDashboardStore().openSidebar }"
    >
      <div class="p-3 flex justify-between items-center">
        <div class="logo"><img src="/images/logo.png" class="w-25" /></div>
        <div class="closeBtn">
          <UIcon
            name="solar:close-circle-linear"
            class="size-5!"
            @click="closeSideBar"
          />
        </div>
      </div>
      <div class="items w-full px-3 divide-y divide-gray-200">
        <ul class="w-full flex flex-col gap-1.5 py-3">
          <li
            v-for="item in dashboardStore.sidebarRoutes"
            :key="item.url"
            class="w-full flex items-center gap-2"
          >
            <nuxt-link class="w-full flex items-center gap-2 mo-items" :to="item.url" @click="closeSideBar">
              <UIcon :name="item.icon" class="size-5!" />
              {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
        <div class="py-3">
          <DashboardLogoutBtn class="h-auto" />
        </div>
      </div>
    </div>
  </nav>

  <div
    v-else
    class="group peer hidden md:block"
    :data-state="state"
    :data-collapsible="state === 'collapsed' ? collapsible : ''"
    :data-variant="variant"
    :data-side="side"
  >
    <!-- This is what handles the sidebar gap on desktop  -->
    <div :class="sideBarStyles().sideBarWrapper({ variant })" />
    <div
      :class="
        sideBarStyles().sideBarWrapper2({
          collapsible,
          side,
          variant,
          class: props.class,
        })
      "
      v-bind="$attrs"
    >
      <div data-sidebar="sidebar" :class="sideBarStyles().sideBarInner()">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { VisuallyHidden } from "radix-vue";
import type { VariantProps } from "tailwind-variants";
import type { HTMLAttributes } from "vue";
import { tv } from "tailwind-variants";

const dashboardStore = useDashboardStore();

const closeSideBar = () => {
  dashboardStore.openSidebar = false;
  document.body.classList.remove("overflow-hidden!");
};

export const sideBarStyles = tv({
  slots: {
    collapsible:
      "flex h-full w-[18rem] lg:w-[16rem] flex-col bg-sidebar text-sidebar-foreground",
    mobileSheet:
      "w-[18rem] lg:w-[16rem] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
    mobileInner: "flex h-full w-full flex-col",
    sideBarWrapper:
      "relative h-svh w-[18rem] lg:w-[16rem] bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180",
    sideBarWrapper2:
      "fixed inset-y-0 z-10 hidden h-svh w-[18rem] lg:w-[16rem] transition-[left,right,width] duration-200 ease-linear md:flex",
    sideBarInner:
      "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
  },
  variants: {
    side: {
      left: {
        sideBarWrapper2:
          "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]",
      },
      right: {
        sideBarWrapper2:
          "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
      },
    },
    variant: {
      sidebar: {
        sideBarWrapper:
          "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        sideBarWrapper2:
          "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l border-gray-300 bg-white",
      },
      floating: {
        sideBarWrapper:
          "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]",
        sideBarWrapper2:
          "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]",
      },
      inset: {
        sideBarWrapper:
          "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]",
        sideBarWrapper2:
          "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]",
      },
    },
    collapsible: {
      offcanvas: {},
      icon: {},
      none: {},
    },
  },
  defaultVariants: {
    side: "left",
    variant: "sidebar",
    collapsible: "offcanvas",
  },
});

export type SideBarProps = {
  /**
   * The side that the sidebar is on
   * @default "left"
   */
  side?: VariantProps<typeof sideBarStyles>["side"];
  /**
   * The variant of the sidebar
   * @default "sidebar"
   */
  variant?: VariantProps<typeof sideBarStyles>["variant"];
  /**
   * The collapsible state of the sidebar
   * @default "offcanvas"
   */
  collapsible?: VariantProps<typeof sideBarStyles>["collapsible"];
  /**
   * Additional classes to add to the sidebar
   */
  class?: HTMLAttributes["class"];
};
</script>
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SideBarProps>(), {
  side: "right",
  variant: "sidebar",
  collapsible: "offcanvas",
});

const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
</script>

<style scoped>
@reference "tailwindcss";
.mobile-sidebar {
  transition: all 0.5s;
}

.sidebar-overlay {
  @apply w-full transition-opacity duration-300 bg-white/10 z-[11] backdrop-blur-[4px] fixed top-0 h-screen;
}
</style>