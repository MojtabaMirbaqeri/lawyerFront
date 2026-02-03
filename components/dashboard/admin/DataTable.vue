<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";
import { getPaginationRowModel } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UBadge = resolveComponent("UBadge");

const table = useTemplateRef("table");
const filterStore = useFiltersStore();

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
    return {
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${law.lawyer_info?.name} ${law.lawyer_info?.family}`,
      base: law.lawyer_info?.base_lawyer?.title,
      baseId: law.lawyer_info?.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: law.lawyer_info?.profile_image,
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
    return {
      id: law?.id,
      national_code: law?.national_code,
      phone: law.phone,
      fullName: `${law?.name} ${law?.family}`,
      base: base?.title,
      baseId: law.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: law?.profile_image,
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
  phone: string;
  base: string;
  baseId: number;
  edit_id: number;
  is_active: boolean;
  profile_image: string | null;
};

const data = ref(
  lawyersRef.value.data.map((law) => {
    return {
      id: law.lawyer_info?.id,
      national_code: law.lawyer_info?.national_code,
      phone: law.phone,
      fullName: `${law.lawyer_info?.name} ${law.lawyer_info?.family}`,
      base: law.lawyer_info?.base_lawyer?.title,
      baseId: law.lawyer_info?.base,
      edit_id: law.id,
      is_active: law.is_active,
      profile_image: law.lawyer_info?.profile_image,
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

const columns: TableColumn<Lawyer>[] = [
  {
    accessorKey: "id",
    header: "شناسه",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "fullName",
    header: "نام و نام خانوادگی",
    cell: ({ row }) => {
      const name = row.getValue("fullName") as string;
      const profile = row.original.profile_image;
      return h("div", { class: "flex items-center gap-3" }, [
        profile
          ? h("img", {
              src: profile,
              class: "w-9 h-9 rounded-full object-cover",
              alt: name,
            })
          : h("div", { class: "avatar-placeholder avatar-sm" }, getInitials(name)),
        h("span", { class: "font-medium text-gray-900" }, name),
      ]);
    },
  },
  {
    accessorKey: "national_code",
    header: "کد ملی",
  },
  {
    accessorKey: "phone",
    header: "شماره تماس",
    cell: ({ row }) =>
      h("span", { class: "font-mono text-gray-600" }, row.getValue("phone")),
  },
  {
    accessorKey: "base",
    header: "پایه",
    cell: ({ row }) => h("span", { class: "badge badge-info" }, row.getValue("base")),
  },
  {
    accessorKey: "is_active",
    header: "وضعیت",
    cell: ({ row }) => {
      const value = row.original.is_active;
      return h(
        "span",
        {
          class: value ? "badge badge-success" : "badge badge-error",
        },
        value ? "فعال" : "غیرفعال",
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return h("div", { class: "flex items-center justify-end gap-1" }, [
        h(UButton, {
          icon: "i-lucide-eye",
          color: "neutral",
          variant: "ghost",
          size: "sm",
          onClick: () =>
            navigateTo(`/dashboard/admin/lawyerlist/edit/${row.original.edit_id}`),
          "aria-label": "مشاهده",
        }),
        h(
          UDropdownMenu,
          {
            content: { align: "end" },
            items: getRowItems(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-more-vertical",
              color: "neutral",
              variant: "ghost",
              size: "sm",
              "aria-label": "Actions dropdown",
            }),
        ),
      ]);
    },
  },
];

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.split(" ");
  return parts
    .map((p) => p.charAt(0))
    .join("")
    .substring(0, 2);
}

function getRowItems(row: Row<Lawyer>) {
  return [
    {
      label: "ویرایش",
      onSelect() {
        navigateTo(`/dashboard/admin/lawyerlist/edit/${row.original.edit_id}`);
      },
      icon: "lucide:edit",
    },
    {
      label: "مشاهده پروفایل",
      onSelect() {
        navigateTo(`/lawyers/${row.original.edit_id}`);
      },
      icon: "lucide:external-link",
    },
    {
      type: "separator",
    },
    {
      label: row.original.is_active ? "غیرفعال کردن" : "فعال کردن",
      icon: row.original.is_active ? "lucide:user-x" : "lucide:user-check",
      async onSelect() {
        const res = await usePatch({
          url: `lawyers/${row.original.edit_id}/toggle-active`,
          includeAuthHeader: true,
          body: undefined,
        });
        if (res.statusCode === 200) {
          useToast().add({
            title: row.original.is_active ? "وکیل غیرفعال شد" : "وکیل فعال شد",
            color: "success",
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
    <div class="card-dashboard" v-if="viewMode === 'list'">
      <div class="overflow-x-auto">
        <UTable
          :data="filteredData"
          :columns="columns"
          class="flex-1"
          :ui="{
            root: 'min-w-full',
            thead: 'bg-gray-50 border-b border-gray-200',
            th: 'text-gray-600 text-xs font-semibold uppercase tracking-wider py-3 px-4',
            td: 'py-3.5 px-4 text-sm',
            tbody: 'divide-y divide-gray-100',
            tr: 'hover:bg-gray-50 transition-colors',
          }" />
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between p-4 border-t border-gray-100">
        <span class="text-sm text-gray-500">
          نمایش {{ (pagination.pageIndex - 1) * pagination.pageSize + 1 }} تا
          {{ Math.min(pagination.pageIndex * pagination.pageSize, pagination.total) }} از
          {{ pagination.total }} مورد
        </span>
        <UPagination
          v-model:page="pagination.pageIndex"
          :items-per-page="pagination.pageSize"
          :total="pagination.total"
          show-edges
          :sibling-count="1"
          :ui="{
            first: 'hidden',
            prev: 'scale-x-[-1]',
            next: 'scale-x-[-1]',
            last: 'hidden',
            list: 'gap-1',
            item: 'min-w-8 h-8 text-sm',
          }"
          @update:page="(p) => (pagination.pageIndex = p)" />
      </div>
    </div>

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
  @apply p-2 text-gray-500 transition-colors;
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
