<template>
  <div id="dashboard-layout">
    <ThingSidebarProvider>
      <ThingSidebar side="right">
        <ThingSheetHeader class="header">
          <NuxtLink to="/">
            <NuxtImg src="/images/logo.png" alt="" class="w-25" />
          </NuxtLink>
        </ThingSheetHeader>
        <ThingSidebarContent class="px-2.5 divide-y divide-gray-200">
          <ThingSidebarGroup>
            <!-- <ThingSidebarGroupLabel :label="authStore.user?.user_type" /> -->
            <ThingSidebarGroupContent>
              <ThingSidebarMenu v-if="chatItems.length <= 0">
                <ThingSidebarMenuItem
                  v-for="item in dashboardStore.sidebarRoutes"
                  :key="item.url"
                >
                  <ThingSidebarMenuButton as-child class="ds-menu-item">
                    <NuxtLink :to="item.url">
                      <Icon :name="item.icon" class="size-4.5!" />
                      <span>{{ item.title }}</span>
                    </NuxtLink>
                  </ThingSidebarMenuButton>
                </ThingSidebarMenuItem>
              </ThingSidebarMenu>
              <ThingSidebarMenu v-else>
                <ThingSidebarMenuItem v-for="item in chatRooms" :key="item.id">
                  <ThingSidebarMenuButton
                    @click="chatStore.selectRoom(item)"
                    as-child
                    class="ds-menu-item cursor-pointer flex items-center gap-2"
                  >
                    <div class="flex items-center gap-2">
                      <!-- پروفایل یا دایره رنگی -->
                      <template v-if="getChatPartner(item)?.profile">
                        <NuxtImg
                          :src="getChatPartner(item).profile"
                          alt="profile"
                          class="w-8 h-8 rounded-full object-cover"
                        />
                      </template>
                      <template v-else>
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                          :style="{ backgroundColor: getColor(item.id) }"
                        >
                          {{
                            getInitials(
                              getChatPartner(item)?.name,
                              getChatPartner(item)?.family
                            )
                          }}
                        </div>
                      </template>

                      <!-- نام طرف مقابل یا گروه -->
                      <div>
                        {{
                          getChatPartner(item)?.name +
                          " " +
                          (getChatPartner(item)?.family || "")
                        }}
                      </div>
                    </div>
                  </ThingSidebarMenuButton>
                </ThingSidebarMenuItem>
              </ThingSidebarMenu>
            </ThingSidebarGroupContent>
          </ThingSidebarGroup>
          <ThingSidebarGroup>
            <ThingSidebarGroupContent>
              <DashboardLogoutBtn  v-if="$route.path.startsWith('/dashboard')"/>
              <button @click="navigateTo('/dashboard')" v-if="$route.path.startsWith('/chat')" class="bg-blue-100 flex gap-2 items-center lg:hidden justify-start rounded-[7px] py-5 px-4 h-9 text-primary w-full text-right">
                <Icon name="hugeicons:dashboard-square-01" class="size-4.5!" />
                <span>برگشت به داشبورد</span>
              </button>
            </ThingSidebarGroupContent>
          </ThingSidebarGroup>
        </ThingSidebarContent>
      </ThingSidebar>
    </ThingSidebarProvider>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Stores
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const chatStore = useChatStore();

// Props
const props = defineProps({
  chatItems: {
    type: Array,
    required: true,
  },
});

// Data
const chatRooms = ref(props.chatItems ? props.chatItems[0] : []);

// رنگ‌های مختلف مثل تلگرام
const colors = [
  "#F44336", "#E91E63", "#9C27B0", "#673AB7",
  "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
  "#FFC107", "#FF9800", "#FF5722"
];

// تابع انتخاب رنگ ثابت بر اساس id روم/کاربر
const getColor = (id) => {
  const index = id % colors.length;
  return colors[index];
};

// گرفتن حروف اول
const getInitials = (name, family) => {
  if (!name && !family) return "?";
  const first = name ? name.charAt(0) : "";
  const last = family ? family.charAt(0) : "";
  return (first + last).toUpperCase();
};

/**
 * در چت دو نفره، اطلاعات کاربر طرف مقابل را برمی‌گرداند
 * اگر گروه بود، اسم و عکس گروه را برمی‌گرداند
 */
const getChatPartner = (room) => {
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
      (member) => member.id !== authStore.user?.id
    );
    console.log(
      partner?.name,
      partner?.family,  
      partner?.profile_image || null,
    );
    
    return {
      name: partner?.name,
      family: partner?.family,
      profile: partner?.profile_image || null,
    };
  }

  return null;
};
</script>

<style scoped>
@reference "tailwindcss";

.header {
  @apply p-5 lg:h-20! justify-center border-b border-gray-300;
}

[data-sidebar="group"] {
  @apply px-0;
}
</style>
