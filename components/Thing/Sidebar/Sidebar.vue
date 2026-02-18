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
      class="mobile-sidebar z-30 h-screen w-[18rem] bg-gradient-to-b from-[#1e3a5f] to-[#0b1726] text-white right-[-100%] fixed top-0 shadow-2xl overflow-hidden"
      :class="{ 'right-0!': useDashboardStore().openSidebar }"
    >
      <!-- Decorative Elements -->
      <div
        class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20"
      >
        <div
          class="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#f59e0b]/10 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="relative z-10 flex flex-col h-full">
        <!-- Header -->
        <div
          class="p-6 flex justify-between items-center border-b border-white/10"
        >
          <div class="logo">
            <NuxtLink to="/">
              <NuxtImg
                src="/images/main-logo.svg"
                width="112"
                height="36"
                loading="eager"
                class="w-28 brightness-0 invert"
              />
            </NuxtLink>
          </div>
          <div class="closeBtn">
            <UIcon
              name="solar:close-circle-linear"
              class="size-6 cursor-pointer text-white/70 hover:text-white transition-colors"
              @click="closeSideBar"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <ul class="space-y-2" v-if="$route.path.startsWith('/dashboard')">
            <li v-for="item in dashboardStore.sidebarRoutes" :key="item.url">
              <nuxt-link
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
                active-class="bg-white/15 backdrop-blur-md shadow-lg border border-white/10 text-white font-medium"
                :class="[
                  $route.path === item.url
                    ? ''
                    : 'text-gray-300 hover:text-white hover:bg-white/5',
                ]"
                :to="item.url"
                @click="closeSideBar"
              >
                <UIcon
                  :name="item.icon"
                  class="size-5 transition-transform duration-300 group-hover:scale-110"
                  :class="$route.path === item.url ? 'text-[#f59e0b]' : ''"
                />
                <span class="text-sm tracking-wide">{{ item.title }}</span>
              </nuxt-link>
            </li>
          </ul>
          <ul class="space-y-2" v-else>
            <li v-for="item in chatStore.chatRooms" :key="item.id">
              <div
                class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/5 group"
                :class="{
                  'bg-white/15 backdrop-blur-md':
                    chatStore.selectedRoom === item.id,
                }"
                @click="handleChatSidebar(item)"
              >
                <!-- Profile Logic -->
                <template v-if="getChatPartner(item)?.profile">
                  <NuxtImg
                    :src="getChatPartner(item).profile"
                    alt="profile"
                    width="36"
                    height="36"
                    loading="lazy"
                    class="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                  />
                </template>
                <template v-else>
                  <div
                    class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                    :style="{ backgroundColor: getColor(item.id) }"
                  >
                    {{
                      getInitials(
                        getChatPartner(item)?.name,
                        getChatPartner(item)?.family,
                      )
                    }}
                  </div>
                </template>

                <!-- نام طرف مقابل یا گروه -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate text-white">
                    {{
                      getChatPartner(item)?.name +
                      " " +
                      (getChatPartner(item)?.family || "")
                    }}
                  </p>
                </div>
              </div>
            </li>
          </ul>

          <div class="py-3 mt-auto">
            <DashboardLogoutBtn
              v-if="$route.path.startsWith('/dashboard')"
              class="w-full"
            />
            <button
              @click="navigateTo('/dashboard')"
              v-if="$route.path.startsWith('/chat')"
              class="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all border border-white/5"
            >
              <UIcon name="solar:arrow-right-linear" class="size-5" />
              <span>بازگشت به داشبورد</span>
            </button>
          </div>
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
      <div
        data-sidebar="sidebar"
        :class="sideBarStyles().sideBarInner()"
        class="bg-gradient-to-b from-[#1e3a5f] to-[#0b1726] text-white border-none shadow-2xl relative overflow-hidden"
      >
        <!-- Decorative Elements -->
        <div
          class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20"
        >
          <div
            class="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
          ></div>
          <div
            class="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#f59e0b]/10 rounded-full blur-3xl"
          ></div>
        </div>

        <!-- Sidebar Content -->
        <div class="relative z-10 flex flex-col h-full">
          <!-- Header/Logo Area -->
          <div
            class="p-6 flex items-center justify-center border-b border-white/10 mb-2"
          >
            <NuxtLink to="/">
              <NuxtImg
                src="/images/main-logo.svg"
                width="128"
                height="40"
                loading="eager"
                class="w-32 brightness-0 invert"
              />
            </NuxtLink>
          </div>

          <!-- Menu Items -->
          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <ul v-if="$route.path.startsWith('/dashboard')" class="space-y-2">
              <li v-for="item in dashboardStore.sidebarRoutes" :key="item.url">
                <nuxt-link
                  :to="item.url"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
                  active-class="bg-white/15 backdrop-blur-md shadow-lg border border-white/10 text-white font-medium"
                  :class="[
                    $route.path === item.url
                      ? ''
                      : 'text-gray-300 hover:text-white hover:bg-white/5',
                  ]"
                >
                  <UIcon
                    :name="item.icon"
                    class="size-5 transition-transform duration-300 group-hover:scale-110"
                    :class="$route.path === item.url ? 'text-[#f59e0b]' : ''"
                  />
                  <span class="text-sm tracking-wide">{{ item.title }}</span>
                  <div
                    v-if="$route.path === item.url"
                    class="ml-auto w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"
                  ></div>
                </nuxt-link>
              </li>
            </ul>

            <!-- Chat List (Keep existing logic but styled) -->
            <ul v-else class="space-y-2">
              <li v-for="item in chatStore.chatRooms" :key="item.id">
                <div
                  class="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/5 group"
                  :class="{
                    'bg-white/15 backdrop-blur-md':
                      chatStore.selectedRoom === item.id,
                  }"
                  @click="chatStore.selectRoom(item)"
                >
                  <!-- Profile Logic -->
                  <template v-if="getChatPartner(item)?.profile">
                    <NuxtImg
                      :src="getChatPartner(item).profile"
                      alt="profile"
                      width="36"
                      height="36"
                      loading="lazy"
                      class="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                    />
                  </template>
                  <template v-else>
                    <div
                      class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                      :style="{ backgroundColor: getColor(item.id) }"
                    >
                      {{
                        getInitials(
                          getChatPartner(item)?.name,
                          getChatPartner(item)?.family,
                        )
                      }}
                    </div>
                  </template>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate text-white">
                      {{
                        getChatPartner(item)?.name +
                        " " +
                        (getChatPartner(item)?.family || "")
                      }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- Footer / Logout -->
          <div class="p-4 border-t border-white/10">
            <DashboardLogoutBtn
              v-if="$route.path.startsWith('/dashboard')"
              class="w-full"
            />
            <button
              v-if="$route.path.startsWith('/chat')"
              @click="navigateTo('/dashboard')"
              class="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-all border border-white/5"
            >
              <UIcon name="solar:arrow-right-linear" class="size-5" />
              <span>بازگشت به داشبورد</span>
            </button>
          </div>
        </div>
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
const chatStore = useChatStore();
const authStore = useAuthStore();

const colors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
];

// تابع انتخاب رنگ ثابت بر اساس id روم/کاربر
const getColor = (id: number) => {
  const index = id % colors.length;
  return colors[index];
};

// گرفتن حروف اول
const getInitials = (name?: string, family?: string) => {
  if (!name && !family) return "?";
  const first = name ? name.charAt(0) : "";
  const last = family ? family.charAt(0) : "";
  return (first + last).toUpperCase();
};

/**
 * در چت دو نفره، اطلاعات کاربر طرف مقابل را برمی‌گرداند
 * اگر گروه بود، اسم و عکس گروه را برمی‌گرداند
 */
const getChatPartner = (room: any) => {
  if (!room) return null;

  // اگر گروهی بود
  if (room.members.length > 2) {
    return {
      name: room.name,
      family: "",
      profile: room.profile_image || null,
    };
  }

  // اگر دو نفره بود
  if (room.members.length === 2) {
    const partner = room.members.find(
      (member: any) => member.id !== authStore.user?.id,
    );
    return {
      name: partner?.name,
      family: partner?.family,
      profile: partner?.profile_image || null,
    };
  }

  return null;
};

const closeSideBar = () => {
  dashboardStore.openSidebar = false;
  document.body.classList.remove("overflow-hidden!");
};

const handleChatSidebar = (item) => {
  chatStore.selectRoom(item);
  closeSideBar();
};

const getChatName = (room) => {
  // If the room has more than 2 members, it's a group chat. Return the room's name.
  if (room.members.length > 2) {
    return room.name;
  }

  // Find the member who is NOT the current logged-in user.
  const otherUser = room.members.find(
    (member) => member.id !== authStore.user?.id,
  );

  // If we found the other user, return their full name.
  if (otherUser) {
    return `${otherUser.name} ${otherUser.family}`;
  }

  // As a fallback (e.g., a chat with only one person), return the original room name.
  return room.name;
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
