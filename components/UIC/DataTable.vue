<!-- eslint-disable vue/require-default-prop -->
<script setup>
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  showPagination: { type: Boolean, default: true },
  columns: { type: Array },
  data: { type: Array },
  total: { type: Number },
  pageIndex: { type: Number },
  perPage: { type: Number },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: "داده‌ای برای نمایش وجود ندارد" },
  stickyHeader: { type: Boolean, default: false },
  // NEW: Enable mobile card view (Binance style)
  mobileCardView: { type: Boolean, default: true },
});

const page = defineModel();

const pagination = ref({
  pageIndex: page,
  pageSize: props?.perPage || 15,
  total: props.total,
});

watch(
  () => props.total,
  (total) => {
    pagination.value.total = total;
  },
);

const totalPages = computed(() =>
  Math.ceil(pagination.value.total / pagination.value.pageSize),
);
const startItem = computed(
  () => (pagination.value.pageIndex - 1) * pagination.value.pageSize + 1,
);
const endItem = computed(() =>
  Math.min(
    pagination.value.pageIndex * pagination.value.pageSize,
    pagination.value.total,
  ),
);

// Check if mobile view should be used
const { width } = useWindowSize();
const isMobileView = computed(() => props.mobileCardView && width.value < 640);

// Helper: create row proxy for cell renderers
const createRowProxy = (row, accessorKey) => ({
  getValue: (key) => row[key || accessorKey],
  original: row,
});
</script>

<template>
  <div class="data-table-wrapper">
    <!-- Loading Overlay -->
    <div v-if="loading" class="table-loading">
      <div class="loading-spinner">
        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-blue-500" />
      </div>
    </div>

    <!-- Desktop Table View -->
    <div
      v-if="!isMobileView"
      class="table-container"
      :class="{ 'sticky-header': stickyHeader }">
      <UTable
        :data="data"
        :column-visibility="{ statusVal: false }"
        :ui="{
          root: 'min-w-full',
          thead: 'bg-gray-50 border-b border-gray-200',
          th: 'text-gray-600 text-xs font-semibold uppercase tracking-wider py-3 px-4 text-right',
          tbody: 'divide-y divide-gray-100',
          tr: 'hover:bg-gray-50 transition-colors',
          td: 'py-3.5 px-4 text-sm text-gray-700',
        }"
        :columns="columns"
        class="flex-1">
        <template #is_active-cell="{ cell }">
          <span class="badge" :class="cell.getValue() ? 'badge-success' : 'badge-error'">
            {{ cell.getValue() ? "فعال" : "غیرفعال" }}
          </span>
        </template>
      </UTable>
    </div>

    <!-- Mobile Card View (Binance Style) -->
    <div v-else class="mobile-cards">
      <div v-for="(row, rowIndex) in data" :key="rowIndex" class="mobile-card">
        <div v-for="column in columns" :key="column.accessorKey" class="mobile-card-row">
          <span class="mobile-card-label">{{ column.header }}</span>
          <span class="mobile-card-value">
            <template v-if="column.cell">
              <component
                :is="
                  () =>
                    column.cell({
                      row: createRowProxy(row, column.accessorKey),
                      getValue: () => row[column.accessorKey],
                    })
                " />
            </template>
            <template v-else>
              {{ row[column.accessorKey] ?? "-" }}
            </template>
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && (!data || data.length === 0)" class="empty-state py-16">
      <div class="empty-state-icon">
        <Icon name="lucide:inbox" class="w-8 h-8" />
      </div>
      <h4 class="empty-state-title">{{ emptyText }}</h4>
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && data && data.length > 0" class="table-pagination">
      <span class="pagination-info hidden sm:inline">
        نمایش {{ startItem }} تا {{ endItem }} از {{ pagination.total }} مورد
      </span>
      <span class="pagination-info sm:hidden">
        {{ pagination.pageIndex }} از {{ totalPages }}
      </span>
      <UPagination
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        show-edges
        :sibling-count="1"
        :default-page="1"
        :ui="{
          list: 'gap-1',
          item: 'min-w-8 h-8 text-sm rounded-lg',
          first: 'scale-x-[-1]',
          last: 'scale-x-[-1]',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
        }"
        @update:page="(p) => (page = p)" />
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.data-table-wrapper {
  @apply relative;
}

.table-loading {
  @apply absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl;
}

.loading-spinner {
  @apply bg-white p-3 rounded-full shadow-lg;
}

.table-container {
  @apply overflow-x-auto;
}

.table-container.sticky-header thead {
  @apply sticky top-0 z-10;
}

.table-pagination {
  @apply flex items-center justify-between p-3 border-t border-gray-100 sm:p-4;
}

.pagination-info {
  @apply text-xs text-gray-500 sm:text-sm;
}

/* Empty State */
.empty-state {
  @apply flex flex-col items-center justify-center text-center;
}

.empty-state-icon {
  @apply w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4;
  color: var(--ui-gray);
}

.empty-state-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

/* Mobile Card View (Binance Style) */
.mobile-cards {
  @apply divide-y divide-gray-100;
}

.mobile-card {
  @apply p-4 space-y-2;
}

.mobile-card:nth-child(odd) {
  @apply bg-gray-50/50;
}

.mobile-card-row {
  @apply flex items-center justify-between gap-4;
}

.mobile-card-label {
  @apply text-xs text-gray-900 font-medium shrink-0;
}

.mobile-card-value {
  @apply text-sm text-gray-500 text-left;
}

/* Make badges work in card view */
.mobile-card-value :deep(.badge),
.mobile-card-value :deep([class*="badge"]) {
  @apply text-xs py-0.5 px-2;
}
</style>
