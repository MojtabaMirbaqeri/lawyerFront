<template>
  <div id="navBar">
    <div class="container">
      <UIcon
        name="heroicons:bars-3-solid"
        class="size-7! lg:hidden!"
        @click="useGlobalStore().toggleSidebar"
      />
      <div class="hidden lg:block w-[140px]">
        <NuxtImg src="/images/logo.png" class="h-6" />
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
          mode="hover"
        >
          <span @click="navigateTo('/#lawyers')"> لیست وکلا </span>

          <template #content>
            <div class="lawyers-popover">
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
                  }"
                />
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
                  }"
                />
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
              class="text-secondary! gap-0.5 text-sm lg:text-[15px]"
              variant="outline"
            >
              ورود / ثبت نام
              <UIcon name="mage:login" class="size-5! rotate-180" />
            </UButton>
          </NuxtLink>
          <UDropdownMenu v-else :items="dropdownItems" :ui="{ content: '' }">
            <UButton
              :label="`${useAuthStore().user?.name} ${
                useAuthStore().user?.family
              }`"
              color="secondary"
              variant="outline"
              icon="solar:user-rounded-linear"
              class="text-secondary! gap-0.5 text-sm lg:text-[15px]"
              :ui="{ leadingIcon: 'size-4.5!' }"
            />
          </UDropdownMenu>
        </div>
      </ClientOnly>
    </div>
    <div
      class="mobile-sidebar"
      :class="{ 'translate-x-0!': useGlobalStore().sidebarVisblity }"
    >
      <div class="header">
        <UIcon
          name="hugeicons:cancel-01"
          class="size-6! p-2"
          @click="useGlobalStore().sidebarVisblity = false"
        />
        <NuxtImg src="/images/logo.png" class="h-6" />
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
          }"
        />
        <NuxtLink
          :to="auth?.token ? '/dashboard' : '/register'"
          class="w-full bg-blue-100/60 py-2.5 px-3 rounded-lg border-blue-200 border flex items-center gap-1.5 text-sm text-blue-500"
        >
          <UIcon
            :name="auth.token ? 'hugeicons:dashboard-square-01' : 'mage:login'"
            class="size-4.5!"
          />
          {{ auth?.token ? "پنل کاربری" : "ورود / ثبت نام" }}
        </NuxtLink>
      </div>
    </div>
    <Transition name="fade">
      <div
        v-if="useGlobalStore().sidebarVisblity"
        class="mobile-overlay"
        @click="useGlobalStore().sidebarVisblity = false"
      />
    </Transition>
  </div>
</template>
<script setup>
const auth = useAuthStore();
await auth.ensureUser();

const filtersStore = useFiltersStore(); // استور تخصص‌ها
const lawyersPopoverVisiblity = ref(false);

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
          children: [], // اینجا تخصص‌ها میاد
        },
        {
          label: "استان ها",
          icon: "lucide:building-2",
          children: [], // استان‌ها اینجا لود می‌شن
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
  try {
    // 🔹 ست کردن تخصص‌ها
    specialties.value = filtersStore.lawyerSpecialties.map((s) => ({
      label: s.title,
      id: String(s.id),
      onSelect() {
        filtersStore.clearFilters();
        navigateTo("/");
        filtersStore.selectedFilters.lawyerSpecialty = s.id;
        lawyersPopoverVisiblity.value = false;
      },
    }));

    const lawyersMenu = menuItems.value[0].find(
      (item) => item.label === "لیست وکلا"
    );
    if (lawyersMenu) {
      // بخش تخصص ها - فقط اگر تخصص وجود داشته باشد
      if (specialties.value.length > 0) {
        const specialtyMenu = lawyersMenu.children.find(
          (child) => child.label === "تخصص ها"
        );
        if (specialtyMenu) {
          specialtyMenu.children = specialties.value;
        }
      } else {
        // اگر تخصص وجود نداشت، آن را از لیست حذف کن
        lawyersMenu.children = lawyersMenu.children.filter(
          (child) => child.label !== "تخصص ها"
        );
      }
    }

    // 🔹 لود استان‌ها
    const provincesRes = await fetch("/provinces.json");
    const rawProvinces = await provincesRes.json();

    provinces.value = (rawProvinces || []).map((province) => ({
      label: province.name,
      id: String(province.id),
      onSelect() {
        filtersStore.clearFilters();
        navigateTo("/");
        filtersStore.setProvince(province.id);
        lawyersPopoverVisiblity.value = false;
      },
    }));

    // بخش استان ها
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
</script>

<style scoped>
@reference "tailwindcss";
#navBar {
  @apply sticky top-0 start-0 z-[100] py-2 h-16;
  @apply w-full;
  @apply bg-white shadow-lg;
}

.container {
  @apply flex items-center gap-6;
}
.mobile-sidebar {
  @apply fixed h-lvh w-[75svw] max-w-[420px]  bg-[#ffffff] top-0 translate-x-[100%] z-10 overflow-y-auto shadow-lg;
  @apply transition-all duration-[450ms] ease-in-out;
}
.mobile-overlay {
  @apply fixed top-0 start-0 h-lvh w-svw bg-black/[10] backdrop-blur-sm;
}
.mobile-sidebar .header {
  @apply flex items-center justify-between h-16 bg-white px-4 sticky top-0! start-0! z-10;
}
.mobile-sidebar .body {
  @apply px-4 space-y-3 pb-4;
}
.desktop-nav {
  @apply items-center gap-5 text-base mx-auto hidden lg:flex;
}
.desktop-nav .router-link-exact-active {
  @apply text-blue-500;
}
.desktop-nav a,
.desktop-nav span {
  @apply transition-all duration-300 hover:text-blue-500!;
}
.lawyers-popover {
  @apply p-4 grid grid-cols-2 gap-6 w-[480px];
}
</style>
