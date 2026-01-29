<!-- eslint-disable vue/require-default-prop -->
<script setup>
const props = defineProps({
  showPagination: { type: Boolean, default: true },
  columns: { type: Array },
  data: { type: Array },
  total: { type: Number },
  pageIndex: { type: Number },
  perPage: { type: Number },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: 'داده‌ای برای نمایش وجود ندارد' },
  stickyHeader: { type: Boolean, default: false },
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
  }
);

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize));
const startItem = computed(() => ((pagination.value.pageIndex - 1) * pagination.value.pageSize) + 1);
const endItem = computed(() => Math.min(pagination.value.pageIndex * pagination.value.pageSize, pagination.value.total));
</script>

<template>
  <div class="data-table-wrapper">
    <!-- Loading Overlay -->
    <div v-if="loading" class="table-loading">
      <div class="loading-spinner">
        <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-blue-500" />
      </div>
    </div>

    <!-- Table -->
    <div class="table-container" :class="{ 'sticky-header': stickyHeader }">
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
        class="flex-1"
      >
        <template #is_active-cell="{ cell }">
          <span 
            class="badge" 
            :class="cell.getValue() ? 'badge-success' : 'badge-error'"
          >
            {{ cell.getValue() ? 'فعال' : 'غیرفعال' }}
          </span>
        </template>
      </UTable>
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
      <span class="pagination-info">
        نمایش {{ startItem }} تا {{ endItem }} از {{ pagination.total }} مورد
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
          first: 'hidden',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
          last: 'hidden',
        }"
        @update:page="(p) => (page = p)"
      />
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
  @apply flex items-center justify-between p-4 border-t border-gray-100;
}

.pagination-info {
  @apply text-sm text-gray-500;
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
</style>
