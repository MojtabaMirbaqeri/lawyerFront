<script setup lang="ts">
const filterStore = useFiltersStore();
const config = useRuntimeConfig();

// View mode
const viewMode = ref<"list" | "grid">("list");

// Filters
const statusFilter = ref<string>("all");
const baseFilter = ref<string>("all");
const selectedRows = ref<Set<number>>(new Set());

const statusOptions = [
  { id: "all", label: "همه" },
  { id: "active", label: "فعال" },
  { id: "inactive", label: "غیرفعال" },
];

const baseOptions = computed(() => [
  { id: "all", label: "همه پایه‌ها" },
  ...filterStore.lawyerTypes.map((type) => ({ id: type.id, label: type.title })),
]);

// Table columns configuration
const tableColumns = [
  { key: 'id', label: 'شناسه' },
  { key: 'fullName', label: 'نام و نام خانوادگی' },
  { key: 'national_code', label: 'کد ملی' },
  { key: 'phone', label: 'شماره تماس' },
  { key: 'base', label: 'پایه' },
  { key: 'is_active', label: 'وضعیت' },
];

const refetch = async (page = null, total = false) => {
  const lawyersRef = ref(
    (
      await useGet({
        url: "lawyers",
        includeAuthHeader: false,
        query: page ? { page: page } : undefined,
      })
    ).data,
  );
  data.value = lawyersRef.value.data.map((law) => {
    const name = law.lawyer_info?.name || '';
    const family = law.lawyer_info?.family || '';
    const slug = `${name}-${family}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${name} ${family}`,
      slug: slug,
      base: law.lawyer_info?.base_lawyer?.title,
      baseId: law.lawyer_info?.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: config.public.imageBase + law.lawyer_info?.profile_image
    };
  });

  if (total) {
    pagination.value.total = lawyersRef.value.meta.total;
    pagination.value.pageIndex = 1;
  }
};

const searchRefetch = async (query, start, page) => {
  const res = await useGet({
    url: "lawyer-search/comprehensive-search",
    includeAuthHeader: true,
    query: { page: page ? page : undefined, query: query },
  });
  const lawyers = ref(res.data.data.data.lawyers);

  data.value = lawyers.value.map((law) => {
    const base = filterStore.lawyerTypes.find((type) => law.base == type.id);
    const name = law?.name || '';
    const family = law?.family || '';
    const slug = `${name}-${family}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: law?.id,
      national_code: law?.national_code,
      phone: law.phone,
      fullName: `${name} ${family}`,
      slug: slug,
      base: base?.title,
      baseId: law.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: config.public.imageBase + law?.profile_image,
    };
  });

  if (start) {
    pagination.value.pageIndex = 1;
  }

  pagination.value.total = res.data.data.data.pagination.total;
};

const lawyersRef = ref((await useGet({ url: "lawyers", includeAuthHeader: true })).data);

type Lawyer = {
  id: string;
  national_code: string;
  fullName: string;
  slug: string;
  phone: string;
  base: string;
  baseId: number;
  edit_id: number;
  is_active: boolean;
  profile_image: string | null;
};

const data = ref(
  lawyersRef.value.data.map((law) => {
    const name = law.lawyer_info?.name || '';
    const family = law.lawyer_info?.family || '';
    const slug = `${name}-${family}`.toLowerCase().replace(/\s+/g, '-');
    
    return {
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${name} ${family}`,
      slug: slug,
      base: law.lawyer_info?.base_lawyer?.title,
      baseId: law.lawyer_info?.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: config.public.imageBase + law.lawyer_info?.profile_image
    };
  }),
);

// Filtered data
const filteredData = computed(() => {
  return data.value.filter((item) => {
    const statusMatch =
      statusFilter.value === "all" ||
      (statusFilter.value === "active" && item.is_active) ||
      (statusFilter.value === "inactive" && !item.is_active);
    const baseMatch = baseFilter.value === "all" || item.baseId === baseFilter.value;
    return statusMatch && baseMatch;
  });
});

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts
    .map((p) => p.charAt(0))
    .join("")
    .substring(0, 2);
}

function getRowActions(row: any) {
  return [
    {
      label: "ویرایش",
      onSelect() {
        navigateTo(`/dashboard/admin/lawyerlist/edit/${row.edit_id}`);
      },
      icon: "lucide:edit",
    },
    {
      label: "مشاهده پروفایل",
      onSelect() {
        navigateTo(`/lawyer/${row.edit_id}/${row.slug}`);
      },
      icon: "lucide:external-link",
    },
    {
      type: "separator" as const,
    },
    {
      label: row.is_active ? "غیرفعال کردن" : "فعال کردن",
      icon: row.is_active ? "lucide:user-x" : "lucide:user-check",
      async onSelect() {
        const res = await usePatch({
          url: `lawyers/${row.edit_id}/toggle-active`,
          includeAuthHeader: true,
          body: undefined,
        });
        if (res.statusCode === 200) {
          useToast().add({ 
            title: row.is_active ? "وکیل غیرفعال شد" : "وکیل فعال شد", 
            color: "success" 
          });
        }
        refetch(pagination.value.pageIndex);
      },
    },
  ];
}

const globalFilter = ref("");

const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
  total: lawyersRef.value.meta.total,
});

watch(
  () => pagination.value.pageIndex,
  async (page) => {
    if (globalFilter.value) {
      searchRefetch(globalFilter.value, false, page);
      return;
    } else {
      refetch(page);
    }
  },
);

const searchLawyer = async () => {
  if (globalFilter.value === "") {
    refetch(null, true);
    return;
  } else {
    searchRefetch(globalFilter.value, true, null);
  }
};

// Bulk actions
const toggleSelectAll = () => {
  if (selectedRows.value.size === filteredData.value.length) {
    selectedRows.value.clear();
  } else {
    selectedRows.value = new Set(filteredData.value.map((d) => d.edit_id));
  }
};

const bulkToggleActive = async (activate: boolean) => {
  // TODO: Implement bulk action API
  useToast().add({
    title: `${selectedRows.value.size} وکیل ${activate ? "فعال" : "غیرفعال"} شد`,
    color: "success",
  });
  selectedRows.value.clear();
  refetch(pagination.value.pageIndex);
};

// Export
const exportToExcel = () => {
  // TODO: Implement export
  useToast().add({ title: "فایل اکسل در حال آماده‌سازی...", color: "info" });
};
</script>

<template>
  <div class="lawyers-list">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">مدیریت وکلا</h1>
        <p class="page-description">{{ pagination.total }} وکیل در سیستم ثبت شده است</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="exportToExcel" class="btn-secondary">
          <Icon name="lucide:download" class="w-4 h-4" />
          <span>خروجی اکسل</span>
        </button>
        <NuxtLink to="/dashboard/admin/lawyerlist/add" class="btn-primary">
          <Icon name="lucide:user-plus" class="w-4 h-4" />
          <span>افزودن وکیل</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Filters & Actions Bar -->
    <div class="card-dashboard">
      <div class="card-dashboard-body py-4!">
        <div class="action-bar">
          <div class="action-bar-start">
            <!-- Search -->
            <div class="search-box">
              <Icon name="lucide:search" class="icon" />
              <input
                v-model="globalFilter"
                @change="searchLawyer"
                type="text"
                placeholder="جستجوی نام، تلفن، کد ملی..."
                class="w-72" />
            </div>

            <!-- Status Filter -->
            <UICSelect
              v-model="statusFilter"
              :items="statusOptions"
              placeholder="وضعیت"
              class="w-36!" />

            <!-- Base Filter -->
            <UICSelect
              v-model="baseFilter"
              :items="baseOptions"
              placeholder="پایه"
              class="w-40!" />
          </div>

          <div class="action-bar-end">
            <!-- View Toggle -->
            <div class="view-toggle">
              <button
                @click="viewMode = 'list'"
                class="view-btn"
                :class="{ active: viewMode === 'list' }">
                <Icon name="lucide:list" class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'grid'"
                class="view-btn"
                :class="{ active: viewMode === 'grid' }">
                <Icon name="lucide:grid-3x3" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Bulk Actions -->
        <div v-if="selectedRows.size > 0" class="bulk-actions">
          <span class="bulk-count">{{ selectedRows.size }} مورد انتخاب شده</span>
          <button @click="bulkToggleActive(true)" class="bulk-btn">
            <Icon name="lucide:check-circle" class="w-4 h-4" />
            فعال کردن
          </button>
          <button @click="bulkToggleActive(false)" class="bulk-btn">
            <Icon name="lucide:x-circle" class="w-4 h-4" />
            غیرفعال کردن
          </button>
          <button @click="selectedRows.clear()" class="bulk-btn text-gray-500!">
            لغو انتخاب
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <dashboard-admin-generic-table
      v-if="viewMode === 'list'"
      :data="filteredData"
      :columns="tableColumns"
      :current-page="pagination.pageIndex"
      :total-items="pagination.total"
      :items-per-page="pagination.pageSize"
      row-key="edit_id"
      empty-title="وکیلی یافت نشد"
      empty-message="با تغییر فیلترها یا جستجو، وکلا را مشاهده کنید"
      empty-icon="lucide:scale"
      @update:page="pagination.pageIndex = $event"
    >
      <!-- Custom cell for ID -->
      <template #cell-id="{ value }">
        <span class="text-gray-600">#{{ value }}</span>
      </template>

      <!-- Custom cell for fullName with avatar -->
      <template #cell-fullName="{ row }">
        <div class="flex items-center gap-3">
          <img v-if="row.profile_image" :src="row.profile_image" class="w-9 h-9 rounded-full object-cover" :alt="row.fullName" />
          <div v-else class="avatar-placeholder avatar-sm">{{ getInitials(row.fullName) }}</div>
          <span class="font-medium text-gray-900">{{ row.fullName }}</span>
        </div>
      </template>

      <!-- Custom cell for phone -->
      <template #cell-phone="{ value }">
        <span class="font-mono text-gray-600">{{ value }}</span>
      </template>

      <!-- Custom cell for base -->
      <template #cell-base="{ value }">
        <span class="badge badge-info">{{ value }}</span>
      </template>

      <!-- Custom cell for status -->
      <template #cell-is_active="{ value }">
        <span class="badge" :class="value ? 'badge-success' : 'badge-error'">
          {{ value ? 'فعال' : 'غیرفعال' }}
        </span>
      </template>

      <!-- Custom actions -->
      <template #actions="{ row }">
        <div class="flex items-center justify-end gap-1">
          <button class="btn-icon" title="مشاهده" @click="navigateTo(`/dashboard/admin/lawyerlist/edit/${row.edit_id}`)">
            <Icon name="lucide:eye" class="w-4 h-4" />
          </button>
          <UDropdownMenu
            :content="{ align: 'end' }"
            :items="getRowActions(row)"
          >
            <button class="btn-icon">
              <Icon name="lucide:more-vertical" class="w-4 h-4" />
            </button>
          </UDropdownMenu>
        </div>
      </template>
    </dashboard-admin-generic-table>

    <!-- Grid View -->
    <div v-else class="lawyers-grid">
      <div
        v-for="lawyer in filteredData"
        :key="lawyer.id"
        class="lawyer-card"
        @click="navigateTo(`/dashboard/admin/lawyerlist/edit/${lawyer.edit_id}`)">
        <div class="lawyer-card-header">
          <div class="lawyer-avatar">
            <img
              v-if="lawyer.profile_image"
              :src="lawyer.profile_image"
              :alt="lawyer.fullName" />
            <div v-else class="avatar-placeholder avatar-lg">
              {{ getInitials(lawyer.fullName) }}
            </div>
          </div>
          <span class="badge" :class="lawyer.is_active ? 'badge-success' : 'badge-error'">
            {{ lawyer.is_active ? "فعال" : "غیرفعال" }}
          </span>
        </div>
        <div class="lawyer-card-body">
          <h3 class="lawyer-name">{{ lawyer.fullName }}</h3>
          <span class="lawyer-base">{{ lawyer.base }}</span>
          <div class="lawyer-meta">
            <span
              ><Icon name="lucide:phone" class="w-3.5 h-3.5" /> {{ lawyer.phone }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.lawyers-list {
  @apply space-y-6;
}

.page-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4;
}

.btn-primary,
.btn-secondary {
  @apply inline-flex items-center gap-2;
}

/* View Toggle */
.view-toggle {
  @apply flex items-center border border-gray-200 rounded-lg overflow-hidden;
}

.view-btn {
  @apply p-2 text-gray-500 transition-colors flex;
}

.view-btn:hover {
  @apply bg-gray-50 text-gray-700;
}

.view-btn.active {
  @apply bg-blue-50 text-blue-600;
}

/* Bulk Actions */
.bulk-actions {
  @apply flex items-center gap-3 mt-4 pt-4 border-t border-gray-100;
}

.bulk-count {
  @apply text-sm font-medium text-gray-700;
}

.bulk-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors;
}

/* Grid View */
.lawyers-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.lawyer-card {
  @apply bg-white rounded-xl border border-gray-100 p-4 cursor-pointer transition-all;
  box-shadow: var(--shadow-sm);
}

.lawyer-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}

.lawyer-card-header {
  @apply flex items-start justify-between mb-3;
}

.lawyer-avatar {
  @apply w-14 h-14 rounded-full overflow-hidden;
}

.lawyer-avatar img {
  @apply w-full h-full object-cover;
}

.lawyer-card-body {
  @apply text-center;
}

.lawyer-name {
  @apply text-sm font-semibold text-gray-900 mb-1;
}

.lawyer-base {
  @apply text-xs text-gray-500 block mb-3;
}

.lawyer-meta {
  @apply flex items-center justify-center gap-1 text-xs text-gray-400;
}
</style>
