<template>
  <div ref="tableWrapper" class="card-dashboard relative">
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 dark:bg-gray-900/80"
    >
      <div class="flex flex-col items-center gap-3">
        <Icon name="lucide:loader-2" class="w-8 h-8 animate-spin text-gray-500" />
        <p class="text-sm text-gray-500">در حال بارگذاری...</p>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="table-dashboard">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :class="column.headerClass">
              {{ column.label }}
            </th>
            <th v-if="hasActions"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            :class="rowClass"
            @click="onRowClick ? $emit('row-click', row) : null">
            <td v-for="column in columns" :key="column.key" :class="column.cellClass">
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCell(row[column.key], column) }}
              </slot>
            </td>
            <td v-if="hasActions">
              <slot name="actions" :row="row">
                <div class="flex items-center justify-end gap-1">
                  <button
                    v-for="action in actions"
                    :key="action.name"
                    class="btn-icon"
                    :title="action.label"
                    @click.stop="$emit(action.event, row)">
                    <Icon :name="action.icon" class="w-4 h-4" />
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State (only when not loading) -->
    <div v-if="!loading && data.length === 0" class="empty-state py-16">
      <slot name="empty">
        <div class="empty-state-icon">
          <Icon :name="emptyIcon" class="w-8 h-8" />
        </div>
        <h4 class="empty-state-title">{{ emptyTitle }}</h4>
        <p class="empty-state-description">{{ emptyMessage }}</p>
      </slot>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && data.length > 0 && showPagination"
      class="flex items-center justify-between p-4 border-t border-gray-100">
      <span class="text-sm text-gray-500">
        صفحه {{ currentPage }} از {{ totalPages }}
      </span>
      <UPagination
        :page="currentPage"
        :items-per-page="itemsPerPage"
        :total="totalItems"
        show-edges
        :sibling-count="1"
        :ui="{
          list: 'gap-1',
          item: 'min-w-8 h-8 text-sm',
          first: 'scale-x-[-1]',
          last: 'scale-x-[-1]',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
        }"
        @update:page="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots, ref, nextTick } from "vue";

const props = defineProps({
  // Data
  data: {
    type: Array,
    required: true,
    default: () => [],
  },

  // Columns configuration
  columns: {
    type: Array,
    required: true,
    // Example: [{ key: 'name', label: 'نام', headerClass: '', cellClass: '', format: 'text' }]
  },

  // Row configuration
  rowKey: {
    type: String,
    default: "id",
  },
  rowClass: {
    type: String,
    default: "",
  },
  onRowClick: {
    type: Boolean,
    default: false,
  },

  // Actions
  actions: {
    type: Array,
    default: () => [],
    // Example: [{ name: 'view', label: 'مشاهده', icon: 'lucide:eye', event: 'view' }]
  },

  // Pagination
  currentPage: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  itemsPerPage: {
    type: Number,
    default: 15,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },

  // Empty state
  emptyTitle: {
    type: String,
    default: "داده‌ای یافت نشد",
  },
  emptyMessage: {
    type: String,
    default: "با تغییر فیلترها یا جستجو، نتایج را مشاهده کنید",
  },
  emptyIcon: {
    type: String,
    default: "lucide:inbox",
  },

  // Loading state
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:page", "row-click"]);
const slots = useSlots();

// Ref for scrolling to top
const tableWrapper = ref(null);

const hasActions = computed(() => props.actions.length > 0 || !!slots.actions);
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

// Handle page change and scroll to top
const handlePageChange = (newPage) => {
  emit("update:page", newPage);
  nextTick(() => {
    if (tableWrapper.value) {
      tableWrapper.value.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

const getRowKey = (row, index) => {
  return row[props.rowKey] || index;
};

const formatCell = (value, column) => {
  if (value === null || value === undefined) return "-";

  switch (column.format) {
    case "currency":
      return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
    case "number":
      return new Intl.NumberFormat("fa-IR").format(value);
    case "date":
      return new Date(value).toLocaleDateString("fa-IR");
    case "phone":
      return value;
    default:
      return value;
  }
};
</script>
