<template>
  <header id="navBar" :class="{ 'nav-scrolled': isScrolled }" class="premium-nav">
    <div class="nav-container">
      <!-- Right (RTL): Logo + horizontal nav (Home, Lawyers, FAQ, Contact) -->
      <NuxtLink to="/" class="logo-block">
        <img
          src="/images/VakilVakilLogo.png"
          alt="وکیل‌وکیل"
          class="logo-img"
          width="140"
          height="36"
          loading="eager" />
      </NuxtLink>

      <nav class="desktop-nav">
        <NuxtLink to="/" class="nav-link">خانه</NuxtLink>
        <UPopover
          v-model:open="lawyersPopoverVisiblity"
          :content="{ align: 'start', side: 'bottom' }"
          :arrow="true"
          :open-delay="0"
          mode="hover">
          <span class="nav-link nav-link--dropdown">
            لیست وکلا
            <UIcon
              name="heroicons:chevron-down-solid"
              class="nav-link-chevron size-4! shrink-0"
              :class="{ 'nav-link-chevron--open': lawyersPopoverVisiblity }" />
          </span>
          <template #content>
            <div class="lawyers-popover" @click="lawyersPopoverVisiblity = false">
              <div class="space-y-1.5">
                <h2 class="popover-heading">استان ها</h2>
                <hr class="popover-divider" />
                <UNavigationMenu
                  class="max-h-64! overflow-y-auto popover-list"
                  :style="{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c0c0c0 transparent',
                  }"
                  orientation="vertical"
                  :items="provinces"
                  :ui="{ list: 'space-y-1.5' }" />
              </div>
              <div v-if="specialties.length > 0" class="space-y-1.5">
                <h2 class="popover-heading">تخصص ها</h2>
                <hr class="popover-divider" />
                <UNavigationMenu
                  class="max-h-64! overflow-y-auto popover-list"
                  :style="{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#c0c0c0 transparent',
                  }"
                  orientation="vertical"
                  :items="specialties"
                  :ui="{ list: 'space-y-1.5' }" />
              </div>
            </div>
          </template>
        </UPopover>
        <NuxtLink to="/faq" class="nav-link">سوالات متداول</NuxtLink>
        <NuxtLink to="/articles" class="nav-link">مقالات</NuxtLink>
        <a href="tel:+982110014488" class="nav-link">تماس با ما</a>
      </nav>

      <!-- Spacer: keeps logo+nav right, actions left (RTL) -->
      <div class="nav-spacer flex-1 min-w-0" aria-hidden="true" />

      <!-- Left (RTL): Get Consultation (accent) + Login/Register (rounded, shadow) -->
      <ClientOnly>
        <div class="nav-actions">
          <NuxtLink to="/lawyers" class="btn-consultation"> دریافت مشاوره </NuxtLink>
          <NuxtLink v-if="!auth.token" to="/register" class="btn-login">
            <UIcon name="heroicons:user-solid" class="size-4!" />
            ورود / ثبت نام
          </NuxtLink>
          <UDropdownMenu v-else :items="dropdownItems" :ui="{ content: '' }">
            <button type="button" class="btn-login btn-login--user">
              <UIcon name="heroicons:user-solid" class="size-4!" />
              <span
                >{{ useAuthStore().user?.name }} {{ useAuthStore().user?.family }}</span
              >
            </button>
          </UDropdownMenu>
        </div>
      </ClientOnly>
    </div>
  </header>

  <!-- نوار ناوبری ثابت پایین (فقط موبایل)، مثل نمونه تصویر -->
  <nav class="mobile-bottom-nav lg:!hidden" aria-label="منوی اصلی">
    <NuxtLink
      to="/"
      class="bottom-nav-item"
      :class="{ 'bottom-nav-item--active': isActive('/') }">
      <UIcon name="lucide:house" class="bottom-nav-icon" />
      <span class="bottom-nav-label">خانه</span>
    </NuxtLink>

    <button 
      type="button"
      class="bottom-nav-item" 
      :class="{ 'bottom-nav-item--active': isLawyersActive }"
      @click="openFiltersDrawer">
      <UIcon name="lucide:layout-list" class="bottom-nav-icon" />
      <span class="bottom-nav-label">لیست وکلا</span>
    </button>

    <NuxtLink to="/lawyers" class="bottom-nav-item bottom-nav-item--center">
      <span class="bottom-nav-center-btn">
        <UIcon name="heroicons:chat-bubble-left-right-solid" class="size-6!" />
      </span>
      <span class="bottom-nav-label">مشاوره</span>
    </NuxtLink>
    <NuxtLink
      to="/faq"
      class="bottom-nav-item"
      :class="{ 'bottom-nav-item--active': isActive('/faq') }">
      <UIcon name="lucide:help-circle" class="bottom-nav-icon" />
      <span class="bottom-nav-label">سوالات</span>
    </NuxtLink>
    <NuxtLink
      :to="auth?.token ? '/dashboard' : '/register'"
      class="bottom-nav-item"
      :class="{
        'bottom-nav-item--active': isActive('/register') || isActive('/dashboard'),
      }">
      <UIcon name="heroicons:user-solid" class="bottom-nav-icon" />
      <span class="bottom-nav-label">{{ auth?.token ? "پنل" : "ورود" }}</span>
    </NuxtLink>
  </nav>
  
  <!-- Filters Drawer for Mobile -->
  <UICDrawer
    v-model="mobileMenuVisibility"
    title="لیست وکلا"
    description="انتخاب استان یا تخصص"
    class="lg:hidden overflow-y-auto!">
    <template #default>
      <LandingLawyersMenu 
        :provinces="provinces" 
        :specialties="specialties"
        @close="mobileMenuVisibility = false" />
    </template>
  </UICDrawer>
</template>

<script setup>
const route = useRoute();
const auth = useAuthStore();
await auth.ensureUser();

const filtersStore = useFiltersStore();
const lawyersPopoverVisiblity = ref(false);
const mobileMenuVisibility = ref(false);

const openFiltersDrawer = () => {
  mobileMenuVisibility.value = true;
};

function isActive(path) {
  if (path === "/") return route.path === "/" && !route.hash;
  if (path === "/faq")
    return route.path === "/faq" || (route.path === "/" && route.hash === "#faq");
  if (path === "/register") return route.path === "/register";
  if (path === "/dashboard") return route.path.startsWith("/dashboard");
  return false;
}
const isLawyersActive = computed(
  () =>
    route.path === "/lawyers" ||
    (route.path === "/" && (route.hash === "#lawyers" || route.hash === "lawyers")),
);
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
      to: "/lawyers",
      children: [
        { label: "همه وکلا", icon: "lucide:users", to: "/lawyers" },
        { label: "تخصص ها", icon: "i-lucide-target", children: [] },
        { label: "استان ها", icon: "lucide:building-2", children: [] },
      ],
    },
    {
      label: "سوالات متداول",
      icon: "lucide:messages-square",
      to: "/faq",
    },
    {
      label: "تماس با ما",
      icon: "lucide:phone",
      to: "tel:+982110014488",
    },
  ],
]);

onMounted(async () => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 20;
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  try {
    specialties.value = filtersStore.lawyerSpecialties.map((s) => ({
      label: s.title,
      id: String(s.id),
      to: `/specialties/${encodeURIComponent(s.title.replace(/\s+/g, "-"))}`,
    }));

    const lawyersMenu = menuItems.value[0].find((item) => item.label === "لیست وکلا");
    if (lawyersMenu) {
      const specialtyMenu = lawyersMenu.children.find((c) => c.label === "تخصص ها");
      if (specialtyMenu && specialties.value.length > 0) {
        specialtyMenu.children = specialties.value;
      } else if (specialtyMenu) {
        lawyersMenu.children = lawyersMenu.children.filter((c) => c.label !== "تخصص ها");
      }
    }

    const rawProvinces = await $fetch("/provinces.json");
    provinces.value = (rawProvinces || []).map((p) => ({
      label: p.name,
      id: String(p.id),
      to: `/provinces/${p.en_name}`,
    }));

    const lawyersMenuForProvinces = menuItems.value[0].find(
      (item) => item.label === "لیست وکلا",
    );
    if (lawyersMenuForProvinces) {
      const provinceMenu = lawyersMenuForProvinces.children.find(
        (c) => c.label === "استان ها",
      );
      if (provinceMenu) provinceMenu.children = provinces.value;
    }
  } catch (err) {
    console.error("fetch provinces or specialties error:", err);
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", () => {});
});
</script>

<style scoped>
@reference "tailwindcss";

.premium-nav {
  --nav-accent: #1e3a5f;
  --nav-accent-soft: #2d5a87;
  --nav-text: #0f172a;
  --nav-text-muted: #475569;
  --nav-border: rgba(0, 0, 0, 0.06);
  --header-height: 80px;
}

#navBar.premium-nav {
  @apply sticky top-0 start-0 z-[100] w-full;
  min-height: 80px;
  background: #ffffff;
  border-bottom: 1px solid var(--nav-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.25s ease;
}

#navBar.premium-nav.nav-scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.nav-container {
  @apply flex items-center gap-6 lg:gap-10 w-full max-w-[1400px] mx-auto px-5 lg:px-10;
  min-height: 80px;
}

/* Right (RTL): Logo + nav with clean spacing */
.logo-block {
  @apply flex items-center gap-2.5 shrink-0 no-underline;
  color: var(--nav-text);
}

.logo-img {
  @apply h-8 w-auto object-contain shrink-0;
  max-height: 40px;
}

.logo-block:hover .logo-img {
  opacity: 0.9;
}

/* Horizontal nav next to logo */
.desktop-nav {
  @apply hidden lg:flex items-center gap-8 min-w-0;
}

.nav-link {
  @apply py-2 text-[15px] font-semibold transition-colors no-underline whitespace-nowrap;
  color: var(--nav-text-muted);
}

.nav-link:hover {
  color: var(--nav-accent);
}

.nav-link--dropdown {
  @apply inline-flex items-center gap-1 cursor-pointer;
}

.nav-link-chevron {
  @apply transition-transform duration-200 text-current opacity-70;
}
.nav-link-chevron--open {
  transform: rotate(180deg);
}

.desktop-nav a.router-link-exact-active,
.desktop-nav a.router-link-active {
  color: var(--nav-accent);
}

/* Popover */
.lawyers-popover {
  @apply p-4 grid grid-cols-2 gap-6 w-[480px] bg-white rounded-2xl;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
  border: 1px solid var(--nav-border);
}
.popover-heading {
  @apply font-semibold text-gray-800;
}
.popover-divider {
  @apply border-gray-200;
}
.popover-list {
  @apply text-gray-700;
}

/* Mobile menu button */
.nav-menu-btn {
  @apply flex items-center justify-center size-10 rounded-xl text-gray-600;
}
.nav-menu-btn:hover {
  @apply bg-gray-100 text-gray-800;
}

/* Left (RTL): Get Consultation (accent) + Login/Register (rounded, shadow) */
.nav-actions {
  @apply flex items-center gap-3 shrink-0;
}

.btn-consultation {
  @apply hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[15px] font-bold text-white transition-all no-underline;
  background: var(--nav-accent);
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.25);
}

.btn-consultation:hover {
  background: var(--nav-accent-soft);
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
}

.btn-login {
  @apply inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl text-[14px] lg:text-[15px] font-semibold transition-all no-underline;
  color: var(--nav-accent);
  background: #ffffff;
  border: 1px solid rgba(30, 58, 95, 0.2);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.btn-login:hover {
  background: rgba(30, 58, 95, 0.04);
  border-color: rgba(30, 58, 95, 0.35);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-login--user {
  @apply cursor-pointer border-0 font-medium;
}

/* نوار ناوبری ثابت پایین (موبایل)، مثل نمونه تصویر */
.mobile-bottom-nav {
  @apply fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-around;
  @apply bg-white border-t border-gray-200/80;
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-top: 0.5rem;
  min-height: 56px;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
}

.bottom-nav-item {
  @apply flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl no-underline transition-colors min-w-0 flex-1;
  color: var(--nav-text-muted);
  max-width: 5rem;
}

.bottom-nav-item:hover {
  color: var(--nav-accent);
}

.bottom-nav-item--active {
  color: var(--nav-accent);
}
.bottom-nav-item--active .bottom-nav-icon {
  color: var(--nav-accent);
}

.bottom-nav-icon {
  @apply size-5 shrink-0;
  color: inherit;
}

.bottom-nav-label {
  @apply text-[10px] font-medium truncate w-full text-center;
}

/* آیتم وسط: دکمه برجسته (مشاوره) */
.bottom-nav-item--center {
  @apply flex-none max-w-none;
}

.bottom-nav-center-btn {
  @apply flex items-center justify-center size-12 rounded-2xl transition-all;
  background: var(--nav-accent);
  box-shadow: 0 4px 14px rgba(30, 58, 95, 0.35);
}
.bottom-nav-item--center:hover .bottom-nav-center-btn {
  background: var(--nav-accent-soft);
  box-shadow: 0 6px 18px rgba(30, 58, 95, 0.4);
}
</style>
