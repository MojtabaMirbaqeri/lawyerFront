<template>
  <section>
    <div class="ds-table-con">
      <!-- Filters Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 items-stretch mb-4">
        <!-- Search input -->
        <div class="flex flex-col justify-between">
          <label>جستجو</label>
          <div class="flex gap-2">
            <UInput
              v-model="search"
              class="grow"
              :ui="{ base: 'h-[40px]' }"
              placeholder="نام یا شماره تلفن..."
              @keyup.enter="onSearch" />
            <UButton
              class="px-3"
              color="primary"
              :ui="{ rounded: 'rounded-md' }"
              icon="solar:magnifer-linear"
              @click="onSearch" />
          </div>
        </div>

        <!-- Base (پایه) select -->
        <UICInput label="پایه">
          <template #input>
            <UICSelect v-model="baseId" :items="basesItems" />
          </template>
        </UICInput>

        <!-- Province select -->
        <UICInput label="استان">
          <template #input>
            <UICSelect v-model="provinceId" :items="provincesItems" />
          </template>
        </UICInput>
      </div>

      <!-- Toolbar -->
      <div class="flex justify-end mb-3">
        <UButton
          color="primary"
          icon="solar:download-minimalistic-linear"
          :loading="exporting"
          :disabled="exporting || loading"
          @click="exportExcel">
          خروجی اکسل
        </UButton>
      </div>

      <!-- Table -->
      <dashboard-admin-generic-table
        :data="data"
        :columns="tableColumns"
        :current-page="page"
        :total-items="total"
        :items-per-page="25"
        row-key="user_id"
        empty-title="وکیلی یافت نشد"
        empty-message="با تغییر فیلترها یا جستجو، وکلا را مشاهده کنید"
        empty-icon="lucide:scale"
        @update:page="page = $event"
      >
        <!-- Custom cell for user_id -->
        <template #cell-user_id="{ value }">
          <span class="text-gray-600">#{{ value }}</span>
        </template>

        <!-- Custom cell for fullname -->
        <template #cell-fullname="{ value }">
          <span class="font-medium text-gray-900">{{ value }}</span>
        </template>

        <!-- Custom cell for phone -->
        <template #cell-phone="{ value }">
          <span class="font-mono text-gray-600">{{ value }}</span>
        </template>

        <!-- Custom actions -->
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-1">
            <button class="btn-icon" title="گزارش" @click="openReport(row)">
              <Icon name="lucide:file-text" class="w-4 h-4" />
            </button>
            <button class="btn-icon" title="مشاهده گزارش‌ها" @click="openReportList(row)">
              <Icon name="lucide:list" class="w-4 h-4" />
            </button>
          </div>
        </template>
      </dashboard-admin-generic-table>

      <!-- Report Modal -->
      <UModal
        v-model:open="reportModalOpen"
        title="ثبت گزارش"
        description="برای ثبت گزارش عنوان و توضیحات را تکمیل کنید.">
        <template #body>
          <div class="space-y-4">
            <UInput
              v-model="reportForm.title"
              :disabled="reportReadOnly"
              label="عنوان"
              placeholder="عنوان گزارش را وارد کنید"
              :ui="{ base: 'h-[40px]' }" />
            <ThingTextarea
              v-model="reportForm.description"
              :disabled="reportReadOnly"
              class="w-full"
              :rows="5"
              placeholder="متن گزارش را وارد کنید" />
            <div
              v-if="reportErrors.title || reportErrors.description"
              class="text-red-500 text-sm">
              <div v-if="reportErrors.title">{{ reportErrors.title }}</div>
              <div v-if="reportErrors.description">{{ reportErrors.description }}</div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between gap-2">
            <UButton
              v-if="reportReadOnly"
              variant="soft"
              color="neutral"
              @click="backToReportList">
              بازگشت
            </UButton>
            <div class="ml-auto flex gap-2">
              <UButton variant="soft" color="neutral" @click="reportModalOpen = false"
                >بستن</UButton
              >
              <UButton
                v-if="!reportReadOnly"
                :loading="reportSubmitting"
                color="primary"
                @click="submitReport"
                >تایید
              </UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Reports List Modal -->
      <UModal
        v-model:open="reportListModalOpen"
        title="مشاهده گزارش‌ها"
        description="گزارش‌های ثبت‌شده برای این وکیل نمایش داده می‌شود.">
        <template #body>
          <div class="space-y-3 max-h-[420px] overflow-y-auto">
            <div
              v-if="reportListLoading"
              class="flex items-center justify-center py-6 text-primary-900">
              <UIcon name="svg-spinners:90-ring-with-bg" class="w-5 h-5 ml-2" />
              در حال بارگذاری...
            </div>

            <div
              v-else-if="!reportList.length"
              class="text-sm text-gray-500 py-4 text-center">
              گزارشی یافت نشد.
            </div>

            <div
              v-for="item in reportList"
              v-else
              :key="item.id"
              class="border border-gray-200 rounded-md p-3 flex items-center justify-between">
              <div class="flex flex-col gap-1">
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-xs text-gray-600">
                  نوع: {{ item.subject_type?.label || "-" }}
                </div>
              </div>
              <UButton
                size="sm"
                variant="soft"
                color="primary"
                icon="solar:eye-outline"
                @click="viewReport(item)">
                مشاهده
              </UButton>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-center">
              <UPagination
                v-model:page="reportListPage"
                :items-per-page="reportListPerPage"
                :total="reportListTotal"
                show-edges
                :sibling-count="1"
                :ui="{
                  first: 'scale-x-[-1]',
                  last: 'scale-x-[-1]',
                  prev: 'scale-x-[-1]',
                  next: 'scale-x-[-1]',
                }" />
            </div>
            <div class="flex justify-end">
              <UButton color="primary" @click="closeReportList()">بستن</UButton>
            </div>
          </div>
        </template>
      </UModal>

      <!-- Loading overlay -->
    </div>
  </section>
</template>

<script setup>
import * as yup from "yup";
const filterStore = useFiltersStore();
const page = ref(1);
const data = ref([]);
const total = ref(0);
const loading = ref(false);
const exporting = ref(false);

// report modal state
const reportModalOpen = ref(false);
const reportSubmitting = ref(false);
const reportForm = reactive({ title: "", description: "" });
const reportErrors = reactive({ title: "", description: "" });
const selectedLawyerId = ref(null);
const reportListModalOpen = ref(false);
const reportReadOnly = ref(false);
const reportList = ref([]);
const reportListLoading = ref(false);
const reportListTotal = ref(0);
const reportListPerPage = ref(10);
const reportListPage = ref(1);
const lastFetchedLawyerId = ref(null);
const openedFromDetailsBack = ref(false);

// filters state
const baseId = ref(0); // 0 => همه
const provinceId = ref(0); // 0 => همه
const search = ref("");

// build select items
const basesItems = computed(() => {
  const list = filterStore?.lawyerTypes || [];
  const mapped = list.map((b) => ({ id: b.id, label: b.title || b.name || b.label }));
  return [{ id: 0, label: "همه" }, ...mapped];
});

const provinces = ref([]);
const provincesItems = computed(() => [
  { id: 0, label: "همه" },
  ...provinces.value.map((p) => ({ id: p.id, label: p.name })),
]);

// load provinces json
onMounted(async () => {
  try {
    const res = await $fetch("/provinces.json");
    provinces.value = Array.isArray(res) ? res : [];
  } catch {
    provinces.value = [];
  }
});

function buildQuery(pageNum = 1, overrides = {}) {
  return {
    page: pageNum,
    base_id: baseId.value || undefined, // send undefined for 0 (همه)
    province_id: provinceId.value || undefined, // undefined for 0
    name: search.value?.trim() ? search.value.trim() : undefined,
    ...overrides,
  };
}

async function fetchLawyers(pageNum = 1, setTotal = false) {
  loading.value = true;
  useLoaderStore().showLoader({ blur: true });
  try {
    const res = await useGet({
      url: "lawyers?per_page=25",
      includeAuthHeader: true,
      query: buildQuery(pageNum),
    });

    const list =
      res?.data?.data ||
      res?.data?.data?.data ||
      res?.data?.data?.lawyers ||
      res?.data ||
      [];

    data.value = (list || []).map((l) => ({
      id: l?.id,
      user_id: l?.user?.id || l?.id,
      fullname: `${l?.name || l?.user?.name || ""} ${
        l?.family || l?.user?.family || ""
      }`.trim(),
      national_code: l?.lawyer_info?.national_code || "-",
      phone: l?.phone || l?.user?.phone || "-",
      province: l?.province || l?.lawyer_info?.province?.name || "-",
      base: l?.base || l?.lawyer_info?.base_lawyer?.title || "-",
    }));

    if (setTotal) {
      // common meta shapes
      total.value =
        res?.data?.meta?.total ||
        res?.data?.data?.meta?.total ||
        res?.data?.data?.data?.pagination?.total ||
        0;
    }
  } finally {
    loading.value = false;
    useLoaderStore().hideLoader();
  }
}

// initial fetch (SSR friendly)
await fetchLawyers(page.value, true);

watch(
  () => page.value,
  (p) => {
    fetchLawyers(p);
  }
);

watch([baseId, provinceId], () => {
  page.value = 1;
  fetchLawyers(1, true);
});

watch(
  () => reportListPage.value,
  () => {
    if (reportListModalOpen.value) fetchReportList();
  }
);

function onSearch() {
  page.value = 1;
  fetchLawyers(1, true);
}

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const tableColumns = [
  { key: 'user_id', label: 'شماره کاربر' },
  { key: 'fullname', label: 'نام و نام خانوادگی' },
  { key: 'national_code', label: 'کدملی' },
  { key: 'phone', label: 'تلفن' },
  { key: 'province', label: 'استان' },
  { key: 'base', label: 'پایه' },
];


async function exportExcel() {
  if (!total.value || total.value < 1) {
    return;
  }
  exporting.value = true;
  useLoaderStore().showLoader({ blur: true });
  try {
    const res = await useGet({
      url: "lawyers",
      includeAuthHeader: true,
      query: { ...buildQuery(1), per_page: total.value },
    });

    const list =
      res?.data?.data ||
      res?.data?.data?.data ||
      res?.data?.data?.lawyers ||
      res?.data ||
      [];

    const rows = (list || []).map((l) => ({
      "شماره کاربر": l?.user?.id || l?.id,
      "نام و نام خانوادگی": `${l?.name || l?.user?.name || ""} ${
        l?.family || l?.user?.family || ""
      }`.trim(),
      کدملی: l?.lawyer_info?.national_code || "-",
      تلفن: l?.phone || l?.user?.phone || "-",
      استان: l?.province || l?.lawyer_info?.province?.name || "-",
      پایه: l?.base || l?.lawyer_info?.base_lawyer?.title || "-",
    }));

    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Compute and set column widths based on content
      const headers = rows.length
        ? Object.keys(rows[0])
        : ["شماره کاربر", "نام و نام خانوادگی", "کدملی", "تلفن", "استان", "پایه"];
      const minWch = 8;
      const maxWch = 30;
      const padding = 2;
      const colWidths = headers.map((h) =>
        Math.max(minWch, Math.min(maxWch, (h || "").length + padding))
      );
      for (const row of rows) {
        headers.forEach((h, idx) => {
          const cellText = (row?.[h] ?? "").toString();
          const w = Math.max(minWch, Math.min(maxWch, cellText.length + padding));
          if (w > colWidths[idx]) colWidths[idx] = w;
        });
      }
      worksheet["!cols"] = colWidths.map((wch) => ({ wch }));

      // Enable Right-To-Left sheet
      // Supported in SheetJS to render grid from right to left in Excel
      worksheet["!rtl"] = true;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Lawyers");
      XLSX.writeFile(workbook, "lawyers.xlsx");
    } catch {
      useToast().add({
        title: "خطا در ساخت فایل اکسل",
        description: "لطفا پکیج xlsx را نصب کنید: npm i xlsx",
        color: "error",
      });
    }
  } finally {
    exporting.value = false;
    useLoaderStore().hideLoader();
  }
}

function openReport(row) {
  selectedLawyerId.value = row?.id || row?.user_id;
  reportForm.title = "";
  reportForm.description = "";
  reportErrors.title = "";
  reportErrors.description = "";
  reportReadOnly.value = false;
  reportModalOpen.value = true;
}

function openReportList(row) {
  const newId = row?.id || row?.user_id;
  selectedLawyerId.value = newId;
  reportListModalOpen.value = true;
  // اگر از جزئیات برگشتیم، فچ نزن؛ در غیر این صورت فچ کن
  if (openedFromDetailsBack.value) {
    openedFromDetailsBack.value = false;
    return;
  }
  reportListPage.value = 1;
  fetchReportList();
}

async function submitReport() {
  // validate with Yup
  const schema = yup.object({
    title: yup.string().required("عنوان الزامی است"),
    description: yup.string().required("متن گزارش الزامی است"),
  });

  reportErrors.title = "";
  reportErrors.description = "";

  try {
    await schema.validate(reportForm, { abortEarly: false });
  } catch (err) {
    if (err?.inner?.length) {
      err.inner.forEach((e) => {
        if (e.path && reportErrors[e.path] !== undefined) {
          reportErrors[e.path] = e.message;
        }
      });
    }
    return;
  }

  reportSubmitting.value = true;
  try {
    const res = await usePost({
      url: "lawyer-notes",
      includeAuthHeader: true,
      body: {
        lawyer_id: selectedLawyerId.value,
        title: reportForm.title,
        description: reportForm.description,
        subject_type: "info_completion",
        communication_type: "phone",
      },
    });
    if (res?.status && res?.statusCode >= 200 && res?.statusCode < 300) {
      useToast().add({ title: "گزارش با موفقیت ثبت شد", color: "success" });
      reportModalOpen.value = false;
      // optional: refresh current page
      fetchLawyers(page.value);
    } else {
      useToast().add({
        title: "ثبت گزارش ناموفق بود",
        description: `خطای سرور (${res?.statusCode || 500})`,
        color: "error",
      });
      return;
    }
  } finally {
    reportSubmitting.value = false;
  }
}

async function fetchReportList() {
  if (!selectedLawyerId.value) return;
  reportListLoading.value = true;
  try {
    const res = await useGet({
      url: `lawyer-notes/lawyer/${selectedLawyerId.value}?per_page=3`,
      includeAuthHeader: true,
      query: { page: reportListPage.value },
    });
    const dataArr = res?.data?.data || [];
    reportList.value = dataArr;
    reportListTotal.value = res?.data?.meta?.total || 0;
    reportListPerPage.value = res?.data?.meta?.per_page || 10;
    lastFetchedLawyerId.value = selectedLawyerId.value;
  } finally {
    reportListLoading.value = false;
  }
}

function viewReport(item) {
  reportForm.title = item?.title || "";
  reportForm.description = item?.description || "";
  reportErrors.title = "";
  reportErrors.description = "";
  reportReadOnly.value = true;
  reportListModalOpen.value = false;
  nextTick(() => {
    reportModalOpen.value = true;
  });
}

function backToReportList() {
  reportModalOpen.value = false;
  nextTick(() => {
    openedFromDetailsBack.value = true;
    reportListModalOpen.value = true;
  });
}

function closeReportList() {
  reportListModalOpen.value = false;
  // بستن دستی لیست، باعث می‌شود در باز شدن بعدی دوباره فچ کنیم
  openedFromDetailsBack.value = false;
}
useHead({
  title: "گزارش و پشتیبانی | وکیل وکیل",
});
</script>
