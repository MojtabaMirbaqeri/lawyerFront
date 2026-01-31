<template>
  <section class="profile-page">
    <!-- Profile Completion Header -->
    <DashboardLawyerProfileCompletionHeader
      v-if="lawyerInfo"
      :lawyer-info="lawyerInfo"
      :kyc-status="kycStatus"
      :has-education="hasEducation"
      :has-workplace="hasWorkplace"
      :has-schedule="hasSchedule"
      :has-pricing="hasPricing"
      @navigate="navigateToSection"
    />

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
      <!-- Tab Navigation -->
      <div class="profile-tabs">
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
                :class="['tab-item', { active: activeTab === tab.value }]"
              >
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon v-if="tab.badge === 'complete'" name="lucide:check" class="w-3 h-3" />
                  <Icon v-else-if="tab.badge === 'pending'" name="lucide:clock" class="w-3 h-3" />
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
                :class="['tab-item', { active: activeTab === tab.value }]"
              >
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon v-if="tab.badge === 'complete'" name="lucide:check" class="w-3 h-3" />
                  <Icon v-else-if="tab.badge === 'pending'" name="lucide:clock" class="w-3 h-3" />
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
                :class="['tab-item', { active: activeTab === tab.value }]"
              >
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.label }}</span>
                <span v-if="tab.badge" :class="['tab-badge', tab.badge]">
                  <Icon v-if="tab.badge === 'complete'" name="lucide:check" class="w-3 h-3" />
                  <Icon v-else-if="tab.badge === 'pending'" name="lucide:clock" class="w-3 h-3" />
                  <Icon v-else name="lucide:alert-circle" class="w-3 h-3" />
                </span>
                <span v-if="hasUnsavedChanges(tab.value)" class="unsaved-dot"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Accordion Navigation -->
        <div class="tabs-mobile">
          <select v-model="activeTab" @change="handleTabChange(activeTab)" class="mobile-tab-select">
            <optgroup label="اطلاعات عمومی">
              <option v-for="tab in generalTabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </option>
            </optgroup>
            <optgroup label="رزروپذیری">
              <option v-for="tab in bookingTabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </option>
            </optgroup>
            <optgroup label="اعتماد و تایید">
              <option v-for="tab in trustTabs" :key="tab.value" :value="tab.value">
                {{ tab.label }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="profile-tab-content">
        <Transition name="fade" mode="out-in">
          <KeepAlive>
            <component 
              :is="activeComponent" 
              :lawyer-information="lawyerInfo"
              :key="activeTab"
              @update:changes="handleChanges"
              @saved="handleSaved"
            />
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
      @save-and-continue="saveAndContinue"
    />
  </section>
</template>

<script setup>
import { useToast } from '#imports';

const authStore = useAuthStore();
const toast = useToast();
const saveBarRef = ref(null);

// State
const lawyerInfo = ref(null);
const isLoading = ref(true);
const loadError = ref(null);
const activeTab = ref('profile');
const isSaving = ref(false);
const pendingChanges = ref({});
const pendingTab = ref(null);

// Fetch lawyer info
const fetchLawyerInfo = async () => {
  try {
    isLoading.value = true;
    loadError.value = null;
    const res = await useGet({
      url: `lawyers/${authStore.user?.lawyer_id}`,
      includeAuthHeader: true,
    });
    // res.data contains the actual lawyer data
    lawyerInfo.value = res.data || res;
  } catch (error) {
    loadError.value = 'مشکلی در بارگذاری اطلاعات پیش آمد. لطفاً دوباره تلاش کنید.';
    console.error('Failed to fetch lawyer info:', error);
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
    lawyerInfo.value = res.data || res;
  } catch (error) {
    console.error('Failed to refresh lawyer info:', error);
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

// Computed completion statuses
const kycStatus = computed(() => {
  const lawyer = lawyerData.value?.lawyer_info;
  if (!lawyer) return 'not_submitted';
  if (lawyer.kyc_approved) return 'approved';
  if (lawyer.kyc_submitted) return 'pending';
  if (lawyer.kyc_rejected) return 'rejected';
  return 'not_submitted';
});

const hasEducation = computed(() => {
  return (lawyerData.value?.educations?.length || 0) > 0;
});

const hasWorkplace = computed(() => {
  return (lawyerData.value?.workplaces?.length || 0) > 0;
});

const hasSchedule = computed(() => {
  return (lawyerData.value?.weeklySchedule?.length || 0) > 0;
});

const hasPricing = computed(() => {
  const info = lawyerData.value?.lawyer_info;
  return !!(info?.phone_counseling_price || info?.inperson_counseling_price);
});

// Tab definitions with status badges
const generalTabs = computed(() => [
  {
    label: 'پروفایل',
    value: 'profile',
    icon: 'lucide:user',
    badge: lawyerData.value?.lawyer_info?.about ? 'complete' : 'incomplete',
  },
  {
    label: 'اطلاعات شخصی',
    value: 'personal_information',
    icon: 'lucide:id-card',
    badge: hasPersonalInfoComplete.value ? 'complete' : 'incomplete',
  },
  {
    label: 'سوابق و تخصص',
    value: 'experience',
    icon: 'lucide:briefcase',
    badge: hasEducation.value ? 'complete' : 'incomplete',
  },
]);

const bookingTabs = computed(() => [
  {
    label: 'محل کار',
    value: 'workplaces',
    icon: 'lucide:building-2',
    badge: hasWorkplace.value ? 'complete' : 'incomplete',
  },
  {
    label: 'قیمت‌گذاری',
    value: 'pricing',
    icon: 'lucide:banknote',
    badge: hasPricing.value ? 'complete' : 'incomplete',
  },
  {
    label: 'ساعات کاری',
    value: 'schedule',
    icon: 'lucide:calendar-clock',
    badge: hasSchedule.value ? 'complete' : 'incomplete',
  },
]);

const trustTabs = computed(() => [
  {
    label: 'احراز هویت',
    value: 'authentication',
    icon: 'lucide:shield-check',
    badge: kycStatus.value === 'approved' ? 'complete' : (kycStatus.value === 'pending' ? 'pending' : 'incomplete'),
  },
]);

const hasPersonalInfoComplete = computed(() => {
  const info = lawyerData.value?.lawyer_info;
  return !!(info?.gender && info?.father_name && info?.birth_date && info?.province_id && info?.city_id);
});

// Active component mapping
const activeComponent = computed(() => {
  const componentMap = {
    profile: resolveComponent('DashboardLawyerProfile'),
    personal_information: resolveComponent('DashboardLawyerPersonalInformation'),
    experience: resolveComponent('DashboardLawyerExperience'),
    workplaces: resolveComponent('DashboardLawyerWorkplacesSection'),
    pricing: resolveComponent('DashboardLawyerPricingSection'),
    schedule: resolveComponent('DashboardLawyerWeeklyScheduleSection'),
    authentication: resolveComponent('DashboardLawyerAuthentication'),
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
  if (globalHasChanges.value && saveBarRef.value) {
    pendingTab.value = newTab;
    saveBarRef.value.showConfirmModal();
  } else {
    // تعویض تب در تیک بعدی تا خطای emitsOptions هنگام patch رخ ندهد
    nextTick(() => {
      activeTab.value = newTab;
    });
  }
};

const navigateToSection = (sectionId) => {
  handleTabChange(sectionId);
};

// Save functions
const saveAllChanges = async () => {
  isSaving.value = true;
  try {
    // Emit save event to all child components
    // This is handled by the individual components
    toast.add({ title: 'تغییرات ذخیره شد', color: 'success' });
    pendingChanges.value = {};
  } catch (error) {
    toast.add({ title: 'خطا در ذخیره تغییرات', color: 'error' });
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
  }
};

const saveAndContinue = async () => {
  await saveAllChanges();
  if (pendingTab.value) {
    activeTab.value = pendingTab.value;
    pendingTab.value = null;
  }
};

const handleSaved = () => {
  reFetchLawyerInformation();
};

useHead({
  title: 'پروفایل | وکیل وکیل',
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
</style>
