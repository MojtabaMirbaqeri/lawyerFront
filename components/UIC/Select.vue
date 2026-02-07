<script setup>
const props = defineProps({
  items: { type: Array, default: () => [] },
  placeholder: { type: String, default: "انتخاب کنید..." },
  label: { type: String, default: '' },
  required: Boolean,
  disabled: Boolean,
  searchable: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
});

const value = defineModel({ type: [String, Number, Object], default: null });
const searchQuery = ref("");

const filteredItems = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.items;
  }
  return props.items.filter((item) =>
    item.label?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const clearSelection = () => {
  value.value = null;
};
</script>

<template>
  <div class="uic-select-wrapper">
    <label v-if="label" class="uic-select-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="uic-select-container">
      <USelect
        v-model="value"
        value-key="id"
        :items="filteredItems"
        :disabled="disabled"
        :placeholder="placeholder"
        :ui="{
          base: 'w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm bg-white transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none h-[42px] appearance-none cursor-pointer',
          trailing: 'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none pe-0',
          trailingIcon: 'w-4 h-4 text-gray-400',
        }"
        class="uic-select" />
      <button
        v-if="clearable && value"
        class="uic-select-clear"
        @click.stop="clearSelection"
      >
        <Icon name="lucide:x" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.uic-select-wrapper {
  @apply w-full;
}

.uic-select-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}

.uic-select-container {
  @apply relative;
}

.uic-select {
  @apply w-full;
}

.uic-select-clear {
  @apply absolute left-10 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors;
}

/* Override USelect styles */
:deep(.uic-select select) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 12px center;
  background-size: 16px;
  padding-left: 40px;
}
</style>
