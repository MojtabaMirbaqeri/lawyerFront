<template>
  <div id="navBar" :class="{ 'nav-scrolled': isScrolled }">
    <div class="container">
      <UIcon
        name="heroicons:bars-3-solid"
        class="size-7! lg:hidden!"
        @click="useGlobalStore().toggleSidebar" />
      <div class="hidden lg:block w-[140px]">
        <NuxtImg src="/images/main-logo.svg" class="h-8" />
      </div>
      <nav class="desktop-nav">
        <NuxtLink to="/"> خانه </NuxtLink>
        <UPopover
          v-model:open="lawyersPopoverVisiblity"
          :content="{
            align: 'start',
            side: 'bottom',
          }"
          :arrow="true"
          :open-delay="0"
          mode="hover">
          <span @click="navigateTo('/#lawyers')"> لیست وکلا </span>

          <template #content>
            <div class="lawyers-popover" @click="lawyersPopoverVisiblity = false">
              <div class="space-y-1.5">
                <h2 class="font-semibold">استان ها</h2>
                <hr class="text-gray-200" />
                <UNavigationMenu
                  class="max-h-64! overflow-y-auto"
                  :style="{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c0c0c0 transparent',
                  }"
                  orientation="vertical"
                  :items="provinces"
                  :ui="{
                    list: 'space-y-1.5',
                  }" />
              </div>
              <div v-if="specialties.length > 0" class="space-y-1.5">
                <h2 class="font-semibold">تخصص ها</h2>
                <hr class="text-gray-200" />
                <UNavigationMenu
                  class="max-h-64! overflow-y-auto"
                  :style="{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c0c0c0 transparent',
                  }"
                  orientation="vertical"
                  :items="specialties"
                  :ui="{
                    list: 'space-y-1.5',
                  }" />
              </div>
            </div>
          </template>
        </UPopover>
        <NuxtLink to="#faq"> سوالات متداول </NuxtLink>
        <NuxtLink to="#comments"> دیدگاه کاربران </NuxtLink>
      </nav>
      <ClientOnly>
        <div class="ms-auto lg:ms-0 lg:w-[140px] flex justify-end">
          <NuxtLink v-if="!auth.token" :to="'/register'">
            <UButton
              color="secondary"
              class="nav-btn"
              variant="outline">
              ورود / ثبت نام
              <UIcon name="mage:login" class="size-5! rotate-180" />
            </UButton>
          </NuxtLink>
          <UDropdownMenu v-else :items="dropdownItems" :ui="{ content: '' }">
            <UButton
              :label="`${useAuthStore().user?.name} ${useAuthStore().user?.family}`"
              color="secondary"
              variant="outline"
              icon="solar:user-rounded-linear"
              class="nav-btn"
              :ui="{ leadingIcon: 'size-4.5!' }" />
          </UDropdownMenu>
        </div>
      </ClientOnly>
    </div>
    <div
      class="mobile-sidebar"
      :class="{ 'translate-x-0!': useGlobalStore().sidebarVisblity }">
      <div class="header">
        <UIcon
          name="hugeicons:cancel-01"
          class="size-6! p-2"
          @click="useGlobalStore().sidebarVisblity = false" />
        <NuxtImg src="/images/main-logo.svg" class="h-8" />
      </div>
      <div class="body">
        <hr class="text-gray-200" />
        <UNavigationMenu
          orientation="vertical"
          :items="menuItems"
          :ui="{
            label: 'py-2.5!',
            link: 'py-2.5!',
            list: 'space-y-1.5',
          }" />
        <NuxtLink
          :to="auth?.token ? '/dashboard' : '/register'"
          class="mobile-auth-btn">
          <UIcon
            :name="auth.token ? 'hugeicons:dashboard-square-01' : 'mage:login'"
            class="size-4.5!" />
          {{ auth?.token ? "پنل کاربری" : "ورود / ثبت نام" }}
        </NuxtLink>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="useGlobalStore().sidebarVisblity"
        class="mobile-overlay"
        @click="useGlobalStore().sidebarVisblity = false" />
    </Transition>
  </div>
</template>

<script setup>
const auth = useAuthStore();
await auth.ensureUser();

const filtersStore = useFiltersStore();
const lawyersPopoverVisiblity = ref(false);
const isScrolled = ref(false);

const provinces = ref([]);
const specialties = ref([]);

const dropdownItems = computed(() => {
  const items = [
    [
      {
        label: "پنل کاربری",
        icon: "hugeicons:dashboard-square-01",
        onSelect() {
          useNavigateToDashboard();
        },
      },
    ],
    [
      {
        label: "خروج",
        color: "error",
        icon: "solar:login-2-linear",
        onSelect() {
          auth.logout();
        },
      },
    ],
  ];

  if (auth.user?.user_type === "user") {
    items[0].push({
      label: "نوبت‌های من",
      icon: "solar:calendar-linear",
      onSelect() {
        navigateTo("/dashboard/appointments");
      },
    });
  }

  return items;
});

const menuItems = ref([
  [
    {
      label: "خانه",
      icon: "lucide:house",
      to: "/",
    },
    {
      label: "لیست وکلا",
      icon: "lucide:layout-list",
      defaultOpen: true,
      to: "/#lawyers",
      children: [
        {
          label: "تخصص ها",
          icon: "i-lucide-target",
          children: [],
        },
        {
          label: "استان ها",
          icon: "lucide:building-2",
          children: [],
        },
      ],
    },
    {
      label: "دیدگاه کاربران",
      icon: "lucide:circle-help",
      to: "#comments",
    },
    {
      label: "سوالات متداول",
      icon: "lucide:messages-square",
      to: "#faq",
    },
  ],
]);

onMounted(async () => {
  // Scroll detection for glassmorphism effect
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  try {
    // Set specialties
    specialties.value = filtersStore.lawyerSpecialties.map((s) => ({
      label: s.title,
      id: String(s.id),
      to: `/specialties/${encodeURIComponent(s.title.replace(/\s+/g, "-"))}`,
    }));

    const lawyersMenu = menuItems.value[0].find((item) => item.label === "لیست وکلا");
    if (lawyersMenu) {
      if (specialties.value.length > 0) {
        const specialtyMenu = lawyersMenu.children.find(
          (child) => child.label === "تخصص ها"
        );
        if (specialtyMenu) {
          specialtyMenu.children = specialties.value;
        }
      } else {
        lawyersMenu.children = lawyersMenu.children.filter(
          (child) => child.label !== "تخصص ها"
        );
      }
    }

    // Load provinces
    const rawProvinces = await $fetch("/provinces.json");

    provinces.value = (rawProvinces || []).map((province) => ({
      label: province.name,
      id: String(province.id),
      to: `/provinces/${province.en_name}`,
    }));

    if (lawyersMenu) {
      const provinceMenu = lawyersMenu.children.find(
        (child) => child.label === "استان ها"
      );
      if (provinceMenu) {
        provinceMenu.children = provinces.value;
      }
    }
  } catch (err) {
    console.error("fetch provinces or cities error:", err);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', () => {});
});
</script>

<style scoped>
@reference "tailwindcss";

#navBar {
  @apply sticky top-0 start-0 z-[100] py-2 h-16;
  @apply w-full;
  @apply bg-white/80;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

#navBar.nav-scrolled {
  @apply bg-white/95;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.container {
  @apply flex items-center gap-6;
}

.mobile-sidebar {
  @apply fixed h-lvh w-[75svw] max-w-[420px] bg-white top-0 translate-x-[100%] z-10 overflow-y-auto;
  @apply transition-all duration-[450ms] ease-in-out;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
}

.mobile-overlay {
  @apply fixed top-0 start-0 h-lvh w-svw bg-black/20 backdrop-blur-sm;
}

.mobile-sidebar .header {
  @apply flex items-center justify-between h-16 bg-white px-4 sticky top-0! start-0! z-10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-sidebar .body {
  @apply px-4 space-y-3 pb-4;
}

.desktop-nav {
  @apply items-center gap-5 text-base mx-auto hidden lg:flex;
}

.desktop-nav .router-link-exact-active {
  @apply font-medium;
  color: #1e3a5f;
}

.desktop-nav a,
.desktop-nav span {
  @apply transition-all duration-300 cursor-pointer;
}
.desktop-nav a:hover,
.desktop-nav span:hover {
  color: #1e3a5f;
}

.lawyers-popover {
  @apply p-4 grid grid-cols-2 gap-6 w-[480px];
}

.nav-btn {
  @apply text-sm lg:text-[15px] gap-1 rounded-xl border-gray-200 transition-all;
}
.nav-btn:hover {
  border-color: #1e3a5f;
  color: #1e3a5f;
}

.mobile-auth-btn {
  @apply w-full py-2.5 px-3 rounded-xl flex items-center gap-1.5 text-sm font-medium text-[#1e3a5f];
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}
</style>

