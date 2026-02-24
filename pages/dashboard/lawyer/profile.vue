<template>
  <section class="profile-page">
    <!-- Profile Completion Header -->
    <DashboardLawyerProfileCompletionHeader
      v-if="lawyerInfo"
      :lawyer-info="lawyerInfo"
      :kyc-status="kycStatus"
      :has-personal-info="hasPersonalInfoComplete"
      :has-profile="hasProfileComplete"
      :has-education="hasEducation"
      :has-workplace="hasWorkplace"
      :has-schedule="hasSchedule"
      :has-pricing="hasPricing"
      @navigate="navigateToSection" />

    <!-- Loading State -->
    <div v-if="isLoading" class="profile-loading">
      <UICSkeletonCard class="h-[200px] mb-6" />
      <UICSkeletonCard class="h-[500px]" />
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="profile-error">
      <div class="error-card">
        <Icon name="lucide:alert-triangle" class="w-12 h-12 text-red-500 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">خطا در بارگذاری اطلاعات</h3>
        <p class="text-sm text-gray-500 mb-4">{{ loadError }}</p>
        <button @click="retryFetch" class="btn-primary">
          <Icon name="lucide:refresh-cw" class="w-4 h-4" />
          تلاش مجدد
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="lawyerInfo" class="profile-content">
      <!-- وضعیت نمایش پروفایل (فعال/غیرفعال) -->
      <div class="profile-visibility-card">
        <div class="visibility-content">
          <div class="visibility-icon" :class="{ inactive: !isActiveDisplay }">
            <Icon :name="isActiveDisplay ? 'lucide:eye' : 'lucide:eye-off'" class="w-5 h-5" />
          </div>
          <div class="visibility-text">
            <h3 class="visibility-title">وضعیت نمایش در سایت</h3>
            <p class="visibility-desc">
              {{ isActiveDisplay ? 'پروفایل شما در جستجو و لیست وکلا نمایش داده می‌شود و کاربران می‌توانند نوبت رزرو کنند.' : 'پروفایل شما در سایت نمایش داده نمی‌شود و امکان رزرو وجود ندارد.' }}
            </p>
          </div>
          <div class="visibility-switch">
            <USwitch
              :model-value="isActiveDisplay"
              :loading="toggleActiveLoading"
              @update:model-value="onToggleActive"
            />
            <span class="visibility-label">{{ isActiveDisplay ? 'فعال' : 'غیرفعال' }}</span>
          </div>
        </div>
      </div>

      <!-- بلوک درخواست نمایش به عنوان وکیل تایید شده -->
      <div class="profile-visibility-card site-verification-block">
        <div class="visibility-content">
          <div class="visibility-icon" :class="{ inactive: !siteVerified }">
            <Icon :name="siteVerified ? 'lucide:badge-check' : 'lucide:badge-plus'" class="w-5 h-5" />
          </div>
          <div class="visibility-text">
            <h3 class="visibility-title">نمایش به عنوان وکیل تایید شده</h3>
            <p class="visibility-desc">
              <template v-if="siteVerified">
                شما به عنوان وکیل تایید شده در سایت نمایش داده می‌شوید.
              </template>
              <template v-else-if="verificationRequestStatus === 'pending'">
                درخواست شما در انتظار بررسی است. پس از تایید توسط تیم پشتیبانی، بج «تایید شده» در کارت شما نمایش داده می‌شود.
              </template>
              <template v-else-if="isProfileComplete">
                با زدن دکمه زیر درخواست خود را برای نمایش به عنوان وکیل تایید شده ارسال کنید. پس از بررسی و تایید، در لیست وکلا با بج «تایید شده» نمایش داده خواهید شد.
              </template>
              <template v-else>
                برای ارسال درخواست نمایش به عنوان وکیل تایید شده، ابتدا پروفایل خود را کامل کنید (اطلاعات شخصی، پروفایل، سوابق، محل کار، قیمت‌گذاری و ساعات کاری).
              </template>
            </p>
          </div>
          <div v-if="!siteVerified && verificationRequestStatus !== 'pending' && isProfileComplete" class="visibility-switch">
            <button
              type="button"
              class="btn-primary"
              :disabled="verificationSubmitLoading"
              @click="submitVerificationRequest">
              <Icon v-if="verificationSubmitLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:send" class="w-4 h-4" />
              ثبت به عنوان تایید شده
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="profile-tabs mb-4">
        <!-- Desktop Tabs -->
        <div class="tabs-desktop">
          <!-- Tab Group: General Info -->
          <div class="tab-group">
            <span class="tab-group-label">اطلاعات عمومی</span>
            <div class="tab-group-items">
              <button
                v-for="tab in generalTabs"
                :key="tab.value"
                @click="handleTabChange(tab.value)"
                :class="['tab-item', { active: activeTab === tab.value }]">
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon
                    v-if="tab.badge === 'complete'"
                    name="lucide:check"
                    class="w-3 h-3" />
                  <Icon
                    v-else-if="tab.badge === 'pending'"
                    name="lucide:clock"
                    class="w-3 h-3" />
                  <Icon v-else name="lucide:alert-circle" class="w-3 h-3" />
                </span>
                <span v-if="hasUnsavedChanges(tab.value)" class="unsaved-dot"></span>
              </button>
            </div>
          </div>

          <!-- Tab Group: Booking -->
          <div class="tab-group">
            <span class="tab-group-label">رزروپذیری</span>
            <div class="tab-group-items">
              <button
                v-for="tab in bookingTabs"
                :key="tab.value"
                @click="handleTabChange(tab.value)"
                :class="['tab-item', { active: activeTab === tab.value }]">
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon
                    v-if="tab.badge === 'complete'"
                    name="lucide:check"
                    class="w-3 h-3" />
                  <Icon
                    v-else-if="tab.badge === 'pending'"
                    name="lucide:clock"
                    class="w-3 h-3" />
                  <Icon v-else name="lucide:alert-circle" class="w-3 h-3" />
                </span>
                <span v-if="hasUnsavedChanges(tab.value)" class="unsaved-dot"></span>
              </button>
            </div>
          </div>

          <!-- Tab Group: Trust -->
          <div class="tab-group">
            <span class="tab-group-label">اعتماد و تایید</span>
            <div class="tab-group-items">
              <button
                v-for="tab in trustTabs"
                :key="tab.value"
                @click="handleTabChange(tab.value)"
                :class="['tab-item', { active: activeTab === tab.value }]">
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon
                    v-if="tab.badge === 'complete'"
                    name="lucide:check"
                    class="w-3 h-3" />
                  <Icon
                    v-else-if="tab.badge === 'pending'"
                    name="lucide:clock"
                    class="w-3 h-3" />
                  <Icon v-else name="lucide:alert-circle" class="w-3 h-3" />
                </span>
                <span v-if="hasUnsavedChanges(tab.value)" class="unsaved-dot"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation -->
        <!-- <div class="tabs-mobile">
          <UICSelect
            v-model="activeTab"
            :items="mobileTabItems"
            placeholder="انتخاب بخش..."
            @update:model-value="handleTabChange" />
        </div> -->
      </div>

      <!-- Tab Content (ref برای اسکرول بعد از کلیک چک‌لیست در موبایل) -->
      <div ref="profileTabContentRef" class="profile-tab-content">
        <Transition name="fade" mode="out-in">
          <KeepAlive>
            <component
              :is="activeComponent"
              :lawyer-information="lawyerInfo"
              :key="activeTab"
              @update:changes="handleChanges"
              @saved="handleSaved" />
          </KeepAlive>
        </Transition>
      </div>
    </div>

    <!-- Sticky Save Bar -->
    <DashboardLawyerStickySaveBar
      ref="saveBarRef"
      :has-changes="globalHasChanges"
      :is-loading="isSaving"
      @save="saveAllChanges"
      @reset="resetAllChanges"
      @discard="discardChanges"
      @save-and-continue="saveAndContinue" />
  </section>
</template>

<script setup>
import { useToast } from "#imports";

const authStore = useAuthStore();
const toast = useToast();
const saveBarRef = ref(null);
const profileTabContentRef = ref(null);

// State
const lawyerInfo = ref(null);
const isLoading = ref(true);
const loadError = ref(null);
const activeTab = ref("profile");
const isSaving = ref(false);
const pendingChanges = ref({});
const pendingTab = ref(null);
const isActiveDisplay = ref(true);
const toggleActiveLoading = ref(false);
const verificationSubmitLoading = ref(false);

// ادغام سوابق تحصیلی، محل کار و ساعات کاری (از APIهای جدا) برای چک‌لیست تکمیل پروفایل
async function mergeEducationAndWorkplaces(rawLawyer) {
  const id = authStore.user?.lawyer_id;
  if (!id) return rawLawyer;
  try {
    const [educationRes, workplacesRes, scheduleRes] = await Promise.all([
      useGet({ url: "lawyer/profile/education", includeAuthHeader: true }),
      useGet({ url: "workplaces", includeAuthHeader: true }),
      useGet({ url: "lawyer_schedules/weekly", includeAuthHeader: true }),
    ]);
    const educations = educationRes?.data?.data ?? educationRes?.data ?? [];
    const workplaces = workplacesRes?.data?.data ?? workplacesRes?.data ?? [];
    const weeklySchedule =
      scheduleRes?.data?.weekly_schedule ?? scheduleRes?.weekly_schedule ?? [];
    const inner = rawLawyer?.data ?? rawLawyer;
    const merged = Array.isArray(inner)
      ? {}
      : { ...inner, educations, workplaces, weeklySchedule };
    return rawLawyer?.data !== undefined ? { ...rawLawyer, data: merged } : merged;
  } catch {
    return rawLawyer;
  }
}

// Fetch lawyer info
const fetchLawyerInfo = async () => {
  try {
    isLoading.value = true;
    loadError.value = null;
    const res = await useGet({
      url: `lawyers/${authStore.user?.lawyer_id}`,
      includeAuthHeader: true,
    });
    const raw = res.data || res;
    lawyerInfo.value = await mergeEducationAndWorkplaces(raw);
  } catch (error) {
    loadError.value = "مشکلی در بارگذاری اطلاعات پیش آمد. لطفاً دوباره تلاش کنید.";
    console.error("Failed to fetch lawyer info:", error);
  } finally {
    isLoading.value = false;
  }
};

// Use onMounted to avoid SSR issues
onMounted(() => {
  fetchLawyerInfo();
});

const retryFetch = () => {
  fetchLawyerInfo();
};

const reFetchLawyerInformation = async () => {
  try {
    const res = await useGet({
      url: `lawyers/${authStore.user?.lawyer_id}`,
      includeAuthHeader: true,
    });
    const raw = res.data || res;
    lawyerInfo.value = await mergeEducationAndWorkplaces(raw);
  } catch (error) {
    console.error("Failed to refresh lawyer info:", error);
  }
};

provide("reFetchLawyerInformation", reFetchLawyerInformation);

// Helper to get lawyer data (handles both nested and flat structures)
const lawyerData = computed(() => {
  const info = lawyerInfo.value;
  if (!info) return null;
  // Handle both {data: {...}} and direct {...} structures
  return info.data || info;
});

// Sync نمایش فعال/غیرفعال از سرور
watch(
  () => lawyerData.value?.is_active,
  (val) => {
    if (val !== undefined && val !== null) isActiveDisplay.value = !!val;
  },
  { immediate: true }
);

// تغییر وضعیت فعال/غیرفعال توسط وکیل
const onToggleActive = async (newVal) => {
  const lawyerId = authStore.user?.lawyer_id;
  if (!lawyerId) return;
  const prev = isActiveDisplay.value;
  isActiveDisplay.value = newVal ?? !prev; // به‌روزرسانی فوری برای UX
  toggleActiveLoading.value = true;
  try {
    const res = await usePatch({
      url: `lawyers/${lawyerId}/toggle-active`,
      includeAuthHeader: true,
    });
    if (res.statusCode === 200) {
      const fromServer = res.data?.is_active ?? isActiveDisplay.value;
      isActiveDisplay.value = fromServer;
      reFetchLawyerInformation();
      await authStore.fetchUser();
      useToast().add({
        title: fromServer ? "پروفایل شما فعال است" : "پروفایل شما غیرفعال شد",
        color: "success",
      });
    } else {
      isActiveDisplay.value = prev;
      useToast().add({ title: "خطا در تغییر وضعیت", color: "error" });
    }
  } catch (e) {
    isActiveDisplay.value = prev;
    useToast().add({ title: "خطا در تغییر وضعیت", color: "error" });
  } finally {
    toggleActiveLoading.value = false;
  }
};

// Computed completion statuses (از authStore.user.lawyer_kyc برای تاییدشده استفاده می‌شود)
const kycStatus = computed(() => {
  if (authStore.user?.lawyer_kyc) return "approved";
  const lawyer = lawyerData.value?.lawyer_info;
  if (!lawyer) return "not_submitted";
  if (lawyer.kyc_approved) return "approved";
  if (lawyer.kyc_submitted) return "pending";
  if (lawyer.kyc_rejected) return "rejected";
  return "not_submitted";
});

const hasEducation = computed(() => {
  return (lawyerData.value?.educations?.length || 0) > 0;
});

const hasWorkplace = computed(() => {
  return (lawyerData.value?.workplaces?.length || 0) > 0;
});

// ساعات کاری وقتی «تکمیل» است که حداقل یک روز دارای حداقل یک بازه (چت/تلفن/حضوری) باشد
const hasSchedule = computed(() => {
  const schedule = lawyerData.value?.weeklySchedule;
  if (!schedule || !Array.isArray(schedule)) return false;
  return schedule.some((day) => {
    const s = day?.schedules;
    if (!s) return false;
    const chat = s.chat ?? [];
    const phone = s.phone ?? [];
    const inperson = s.inperson ?? [];
    return (
      (Array.isArray(chat) && chat.length > 0) ||
      (Array.isArray(phone) && phone.length > 0) ||
      (Array.isArray(inperson) && inperson.length > 0)
    );
  });
});

const hasPricing = computed(() => {
  const d = lawyerData.value;
  // همان کلیدهای استفاده‌شده در بخش قیمت‌گذاری
  return !!(
    d?.consultation_price_phone ||
    d?.consultation_price_chat ||
    d?.consultation_price_inperson ||
    d?.lawyer_info?.phone_counseling_price ||
    d?.lawyer_info?.inperson_counseling_price
  );
});

// Tab definitions with status badges
const generalTabs = computed(() => [
  {
    label: "پروفایل",
    value: "profile",
    icon: "lucide:user",
    badge: hasProfileComplete.value ? "complete" : "incomplete",
  },
  {
    label: "اطلاعات شخصی",
    value: "personal_information",
    icon: "lucide:id-card",
    badge: hasPersonalInfoComplete.value ? "complete" : "incomplete",
  },
  {
    label: "سوابق و تخصص",
    value: "experience",
    icon: "lucide:briefcase",
    badge: hasEducation.value ? "complete" : "incomplete",
  },
]);

const bookingTabs = computed(() => [
  {
    label: "محل کار",
    value: "workplaces",
    icon: "lucide:building-2",
    badge: hasWorkplace.value ? "complete" : "incomplete",
  },
  {
    label: "قیمت‌گذاری",
    value: "pricing",
    icon: "lucide:banknote",
    badge: hasPricing.value ? "complete" : "incomplete",
  },
  {
    label: "ساعات کاری",
    value: "schedule",
    icon: "lucide:calendar-clock",
    badge: hasSchedule.value ? "complete" : "incomplete",
  },
]);

const trustTabs = computed(() => [
  {
    label: "احراز هویت",
    value: "authentication",
    icon: "lucide:shield-check",
    badge:
      kycStatus.value === "approved"
        ? "complete"
        : kycStatus.value === "pending"
          ? "pending"
          : "incomplete",
  },
]);

// Mobile tabs items for UICSelect (flattened from all groups)
const mobileTabItems = computed(() => {
  const allTabs = [
    ...generalTabs.value,
    ...bookingTabs.value,
    ...trustTabs.value,
  ];
  return allTabs.map((tab) => ({
    id: tab.value,
    label: tab.label,
  }));
});

const hasPersonalInfoComplete = computed(() => {
  const info = lawyerData.value?.lawyer_info;
  return !!(
    info?.gender &&
    info?.father_name &&
    info?.birth_date &&
    info?.province_id &&
    info?.city_id
  );
});

const hasProfileComplete = computed(() => {
  const info = lawyerData.value?.lawyer_info;
  return !!(info?.about && info?.about.length > 50);
});

// تکمیل بودن پروفایل برای امکان درخواست «تایید شده»
const isProfileComplete = computed(
  () =>
    hasPersonalInfoComplete.value &&
    hasProfileComplete.value &&
    hasEducation.value &&
    hasWorkplace.value &&
    hasSchedule.value &&
    hasPricing.value
);

// وضعیت تایید سایت و درخواست (از پاسخ GET lawyers/{id} برای پروفایل خود وکیل)
const siteVerified = computed(() => lawyerData.value?.site_verified === true);
const verificationRequestStatus = computed(() => lawyerData.value?.verification_request_status ?? null);

async function submitVerificationRequest() {
  verificationSubmitLoading.value = true;
  try {
    const res = await usePost({
      url: "lawyer/verification-request",
      includeAuthHeader: true,
    });
    if (res.statusCode === 201 || res.statusCode === 200) {
      await reFetchLawyerInformation();
      toast.add({ title: "درخواست شما با موفقیت ثبت شد", color: "success" });
    } else {
      toast.add({ title: res.message || "خطا در ثبت درخواست", color: "error" });
    }
  } catch (e) {
    toast.add({ title: "خطا در ثبت درخواست", color: "error" });
  } finally {
    verificationSubmitLoading.value = false;
  }
}

// Active component mapping
const activeComponent = computed(() => {
  const componentMap = {
    profile: resolveComponent("DashboardLawyerProfile"),
    personal_information: resolveComponent("DashboardLawyerPersonalInformation"),
    experience: resolveComponent("DashboardLawyerExperience"),
    workplaces: resolveComponent("DashboardLawyerWorkplacesSection"),
    pricing: resolveComponent("DashboardLawyerPricingSection"),
    schedule: resolveComponent("DashboardLawyerWeeklyScheduleSection"),
    authentication: resolveComponent("DashboardLawyerAuthentication"),
  };
  return componentMap[activeTab.value] || componentMap.profile;
});

// Change tracking
const globalHasChanges = computed(() => {
  return Object.values(pendingChanges.value).some(Boolean);
});

const hasUnsavedChanges = (tabValue) => {
  return !!pendingChanges.value[tabValue];
};

const handleChanges = (tabValue, hasChanges) => {
  pendingChanges.value[tabValue] = hasChanges;
};

const handleTabChange = (newTab) => {
  // جابجایی بین تب‌ها بدون نمایش مودال؛ تغییرات ذخیره‌نشده با نقطه روی تب و نوار پایین نشان داده می‌شوند
  activeTab.value = newTab;
  scrollToTabContent();
};

const scrollToTabContent = () => {
  nextTick(() => {
    profileTabContentRef.value?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  });
};

const navigateToSection = (sectionId) => {
  activeTab.value = sectionId;
  scrollToTabContent();
};

// Save functions
const saveAllChanges = async () => {
  isSaving.value = true;
  try {
    // Emit save event to all child components
    // This is handled by the individual components
    toast.add({ title: "تغییرات ذخیره شد", color: "success" });
    pendingChanges.value = {};
  } catch (error) {
    toast.add({ title: "خطا در ذخیره تغییرات", color: "error" });
  } finally {
    isSaving.value = false;
  }
};

const resetAllChanges = () => {
  // Trigger reset in child components via provide/inject or event bus
  pendingChanges.value = {};
  reFetchLawyerInformation();
};

const discardChanges = () => {
  pendingChanges.value = {};
  if (pendingTab.value) {
    activeTab.value = pendingTab.value;
    pendingTab.value = null;
    scrollToTabContent();
  }
};

const saveAndContinue = async () => {
  await saveAllChanges();
  if (pendingTab.value) {
    activeTab.value = pendingTab.value;
    pendingTab.value = null;
    scrollToTabContent();
  }
};

const handleSaved = () => {
  reFetchLawyerInformation();
};

useHead({
  title: "پروفایل | وکیل وکیل",
});
</script>

<style scoped>
@reference "tailwindcss";

.profile-page {
  @apply flex flex-col gap-6 pb-20;
}

/* Loading State */
.profile-loading {
  @apply flex flex-col;
}

/* Error State */
.profile-error {
  @apply flex items-center justify-center py-20;
}

.error-card {
  @apply flex flex-col items-center text-center p-8 bg-white rounded-xl border border-gray-100;
  box-shadow: var(--shadow-sm);
}

/* Tabs */
.profile-tabs {
  @apply bg-white rounded-xl border border-gray-100 overflow-hidden;
  box-shadow: var(--shadow-sm);
}

.tabs-desktop {
  @apply hidden lg:flex flex-wrap gap-2 p-4;
}

.tabs-mobile {
  @apply lg:hidden p-4;
}

.mobile-tab-select {
  @apply w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm font-medium;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.tab-group {
  @apply flex flex-col gap-2;
}

.tab-group-label {
  @apply text-xs font-medium text-gray-400 uppercase tracking-wide px-2;
}

.tab-group-items {
  @apply flex flex-wrap gap-1;
}

.tab-item {
  @apply relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium;
  @apply text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all;
}

.tab-item.active {
  @apply bg-blue-50 text-blue-700;
}

.tab-badge {
  @apply w-5 h-5 rounded-full flex items-center justify-center;
}

.tab-badge.complete {
  @apply bg-green-100 text-green-600;
}

.tab-badge.pending {
  @apply bg-amber-100 text-amber-600;
}

.tab-badge.incomplete {
  @apply bg-gray-100 text-gray-400;
}

.unsaved-dot {
  @apply absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500;
}

/* Profile visibility card */
.profile-visibility-card {
  @apply bg-white rounded-xl border border-gray-100 p-4 mb-4;
  box-shadow: var(--shadow-sm);
}

.visibility-content {
  @apply flex flex-wrap items-center gap-4;
}

.visibility-icon {
  @apply w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0;
}

.visibility-icon.inactive {
  @apply bg-gray-100 text-gray-500;
}

.visibility-text {
  @apply flex-1 min-w-0;
}

.visibility-title {
  @apply text-sm font-semibold text-gray-900 mb-0.5;
}

.visibility-desc {
  @apply text-xs text-gray-500 leading-relaxed;
}

.visibility-switch {
  @apply flex items-center gap-2 shrink-0;
}

.visibility-label {
  @apply text-sm font-medium text-gray-600 min-w-12;
}

/* Tab Content */
.profile-tab-content {
  @apply bg-white rounded-xl border border-gray-100 p-6;
  box-shadow: var(--shadow-sm);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .profile-page {
    @apply gap-4;
  }

  .tabs-mobile {
    @apply block;
  }

  .tabs-desktop {
    @apply hidden;
  }

  .mobile-tab-select {
    @apply w-full p-3 border border-gray-200 rounded-lg text-sm font-medium;
    @apply bg-white focus:outline-none focus:ring-2 focus:ring-blue-500;
  }

  .profile-tab-content {
    @apply p-3 rounded-lg;
  }

  .tab-group-label {
    @apply text-[10px];
  }

  .tab-item {
    @apply px-3 py-2 text-xs gap-1.5;
  }

  .tab-badge {
    @apply w-4 h-4;
  }
}
</style>
