<template>
  <div class="merge-lawyers-page">
    <!-- Page Header (هم‌سبک با افزودن وکیل) -->
    <div class="page-header mb-6">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="btn-icon"
          aria-label="بازگشت به لیست وکلا"
          @click="navigateTo('/dashboard/admin/lawyerlist')">
          <Icon name="lucide:arrow-right" class="w-5 h-5" />
        </button>
        <div>
          <h1 class="page-title">ادغام وکلا</h1>
          <p class="page-description">
            وکیل مبدا و وکیل مقصد را انتخاب کنید. اطلاعات مبدا در مقصد جایگزین می‌شود و وکیل مبدا حذف خواهد شد.
          </p>
        </div>
      </div>
    </div>

    <!-- Card اصلی -->
    <div class="card-dashboard merge-card">
      <div class="card-dashboard-header">
        <h2 class="card-dashboard-title">انتخاب وکلا برای ادغام</h2>
        <span class="text-sm text-gray-500">مرحله ۱ از ۱</span>
      </div>
      <div class="card-dashboard-body">
        <!-- هشدار -->
        <div class="merge-alert">
          <Icon name="lucide:alert-triangle" class="merge-alert-icon" />
          <div>
            <p class="merge-alert-title">توجه: این عمل قابل بازگشت نیست</p>
            <p class="merge-alert-text">
              تمام اطلاعات وکیل مقصد با وکیل مبدا جایگزین می‌شود و وکیل مبدا حذف خواهد شد. نوبت‌ها، نظرات و سایر داده‌های وکیل مبدا به وکیل مقصد منتقل می‌شوند.
            </p>
          </div>
        </div>

        <!-- انتخاب وکلا با فلوی بصری -->
        <div class="merge-flow">
          <div class="merge-select-block">
            <label class="label-dashboard">
              <Icon name="lucide:user-minus" class="w-4 h-4" />
              وکیل مبدا (منبع اطلاعات)
            </label>
            <p class="merge-hint">اطلاعات این وکیل روی وکیل مقصد اعمال و سپس حذف می‌شود.</p>
            <USelectMenu
              v-model="sourceLawyerId"
              v-model:search-term="sourceSearchTerm"
              :items="sourceLawyerOptionsForDisplay"
              value-key="id"
              label-key="label"
              placeholder="جستجو با نام یا شماره تلفن..."
              class="merge-select"
              :loading="sourceLoading"
              ignore-filter
              :search-input="{ placeholder: 'جستجو با نام یا شماره تلفن...' }"
              clear
              style="width: stretch;"
            />
          </div>

          <div class="merge-arrow" aria-hidden="true">
            <Icon name="lucide:arrow-left" class="w-8 h-8 text-[#1e3a5f]" />
          </div>

          <div class="merge-select-block">
            <label class="label-dashboard">
              <Icon name="lucide:user-check" class="w-4 h-4" />
              وکیل مقصد (وکیلی که باقی می‌ماند)
            </label>
            <p class="merge-hint">پروفایل و تمام داده‌های منتقل‌شده به این وکیل تعلق می‌گیرد.</p>
            <USelectMenu
              v-model="destinationLawyerId"
              v-model:search-term="destinationSearchTerm"
              :items="destinationLawyerOptionsForDisplay"
              value-key="id"
              label-key="label"
              placeholder="جستجو با نام یا شماره تلفن..."
              class="merge-select"
              :loading="destinationLoading"
              ignore-filter
              :search-input="{ placeholder: 'جستجو با نام یا شماره تلفن...' }"
              clear
              style="width: stretch;"
            />
          </div>
        </div>

        <!-- دکمه‌های اقدام -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            :disabled="mergeLoading"
            @click="navigateTo('/dashboard/admin/lawyerlist')">
            <Icon name="lucide:x" class="w-4 h-4" />
            انصراف
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="!canMerge || mergeLoading"
            @click="confirmAndMerge">
            <Icon v-if="mergeLoading" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:merge" class="w-4 h-4" />
            ادغام وکلا
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { refDebounced } from "@vueuse/core";

useHead({
  title: "ادغام وکلا | وکیل وکیل",
});

type LawyerOption = {
  id: number;
  label: string;
  phone?: string;
};

function mapLawToOption(law: any): LawyerOption {
  const name = law.name ?? law.lawyer_info?.name ?? "";
  const family = law.family ?? law.lawyer_info?.family ?? "";
  const phone = law.phone ?? law.user?.phone ?? "";
  return {
    id: law.id,
    label: `${name} ${family}${phone ? ` — ${phone}` : ""}`.trim() || "—",
    phone,
  };
}

const sourceLawyerId = ref<number | undefined>(undefined);
const destinationLawyerId = ref<number | undefined>(undefined);
const sourceLawyerSelected = ref<LawyerOption | null>(null);
const destinationLawyerSelected = ref<LawyerOption | null>(null);
const sourceSearchTerm = ref("");
const destinationSearchTerm = ref("");
const sourceSearchTermDebounced = refDebounced(sourceSearchTerm, 350);
const destinationSearchTermDebounced = refDebounced(destinationSearchTerm, 350);
const sourceLawyerOptions = ref<LawyerOption[]>([]);
const destinationLawyerOptions = ref<LawyerOption[]>([]);
const sourceLoading = ref(false);
const destinationLoading = ref(false);
const mergeLoading = ref(false);

const sourceLawyerOptionsForDisplay = computed(() => {
  const opts = [...sourceLawyerOptions.value];
  if (sourceLawyerSelected.value && !opts.some((o) => o.id === sourceLawyerSelected.value!.id)) {
    opts.unshift(sourceLawyerSelected.value!);
  }
  if (opts.length === 0 && sourceSearchTermDebounced.value.trim().length >= 2 && !sourceLoading.value) {
    return [{ id: -1, label: "نتیجه‌ای یافت نشد" }] as LawyerOption[];
  }
  return opts;
});

const destinationLawyerOptionsForDisplay = computed(() => {
  const opts = [...destinationLawyerOptions.value];
  if (destinationLawyerSelected.value && !opts.some((o) => o.id === destinationLawyerSelected.value!.id)) {
    opts.unshift(destinationLawyerSelected.value!);
  }
  if (opts.length === 0 && destinationSearchTermDebounced.value.trim().length >= 2 && !destinationLoading.value) {
    return [{ id: -1, label: "نتیجه‌ای یافت نشد" }] as LawyerOption[];
  }
  return opts;
});

watch(sourceLawyerId, (id) => {
  if (id === undefined) {
    sourceLawyerSelected.value = null;
    return;
  }
  const found = sourceLawyerOptions.value.find((o) => o.id === id);
  if (found) sourceLawyerSelected.value = found;
});

watch(destinationLawyerId, (id) => {
  if (id === undefined) {
    destinationLawyerSelected.value = null;
    return;
  }
  const found = destinationLawyerOptions.value.find((o) => o.id === id);
  if (found) destinationLawyerSelected.value = found;
});

async function fetchSourceLawyers() {
  const term = sourceSearchTermDebounced.value.trim();
  if (term.length < 2) {
    sourceLawyerOptions.value = [];
    return;
  }
  sourceLoading.value = true;
  try {
    const res = await useGet({
      url: "admin/lawyers/metrics",
      includeAuthHeader: true,
      query: { search: term, per_page: 20 },
    });
    const resData = (res as { data?: { data?: unknown[] } })?.data;
    const list = Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : [];
    sourceLawyerOptions.value = list.map((law: any) => mapLawToOption(law));
  } finally {
    sourceLoading.value = false;
  }
}

async function fetchDestinationLawyers() {
  const term = destinationSearchTermDebounced.value.trim();
  if (term.length < 2) {
    destinationLawyerOptions.value = [];
    return;
  }
  destinationLoading.value = true;
  try {
    const res = await useGet({
      url: "admin/lawyers/metrics",
      includeAuthHeader: true,
      query: { search: term, per_page: 20 },
    });
    const resData = (res as { data?: { data?: unknown[] } })?.data;
    const list = Array.isArray(resData?.data) ? resData.data : Array.isArray(resData) ? resData : [];
    destinationLawyerOptions.value = list.map((law: any) => mapLawToOption(law));
  } finally {
    destinationLoading.value = false;
  }
}

watch(sourceSearchTermDebounced, fetchSourceLawyers);
watch(destinationSearchTermDebounced, fetchDestinationLawyers);

const canMerge = computed(() => {
  const src = sourceLawyerId.value;
  const dest = destinationLawyerId.value;
  return src !== undefined && dest !== undefined && src !== dest && src > 0 && dest > 0;
});

async function confirmAndMerge() {
  const src = sourceLawyerId.value;
  const dest = destinationLawyerId.value;
  if (src === undefined || dest === undefined || src === dest || src <= 0 || dest <= 0) return;
  if (
    !confirm(
      "آیا از ادغام این دو وکیل اطمینان دارید؟ وکیل مبدا حذف خواهد شد و این عمل قابل بازگشت نیست."
    )
  )
    return;

  mergeLoading.value = true;
  try {
    const res = await usePost(
      {
        url: "admin/lawyers/merge",
        includeAuthHeader: true,
        body: {
          source_lawyer_id: src,
          destination_lawyer_id: dest,
        },
      },
      true
    );
    if (res.statusCode === 200) {
      useToast().add({ title: "ادغام وکلا با موفقیت انجام شد.", color: "success" });
      navigateTo("/dashboard/admin/lawyerlist");
    } else {
      useToast().add({ title: res.message || "خطا در ادغام وکلا.", color: "error" });
    }
  } finally {
    mergeLoading.value = false;
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.merge-lawyers-page {
  @apply mx-auto;
}

.merge-card {
  @apply overflow-hidden;
}

.merge-alert {
  @apply flex gap-3 p-4 rounded-xl mb-6;
  background: rgb(254 249 195 / 0.5);
  border: 1px solid rgb(245 158 11 / 0.3);
}

.merge-alert-icon {
  @apply w-5 h-5 shrink-0 mt-0.5;
  color: rgb(180 83 9);
}

.merge-alert-title {
  @apply font-medium text-amber-900 mb-0.5;
}

.merge-alert-text {
  @apply text-sm text-amber-800/90 leading-relaxed;
}

.merge-flow {
  @apply flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6;
}

.merge-select-block {
  @apply flex-1 space-y-2;
}

.merge-hint {
  @apply text-xs text-gray-500 -mt-0.5;
}

.merge-select {
  @apply w-full;
}

.merge-arrow {
  @apply flex items-center justify-center py-2 md:py-0;
}

.form-actions {
  @apply flex flex-wrap items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-100;
}

.label-dashboard {
  @apply flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
