<!-- eslint-disable vue/require-default-prop -->
<script setup>
// import { h, resolveComponent } from "vue";
// import type { TableColumn } from "@nuxt/ui";

const props = defineProps({
  showPagination: { type: Boolean, default: true },
  columns: { type: Array },
  data: { type: Array },
  total: { type: Number },
  pageIndex: { type: Number },
  perPage: { type: Number },
});

const page = defineModel();

const pagination = ref({
  pageIndex: page,
  pageSize: props?.perPage || 10,
  total: props.total,
});

watch(
  () => props.total,
  (total) => {
    pagination.value.total = total;
  }
);
</script>

<template>
  <div class="">
    <UTable
      :data="data"
      :column-visibility="{ statusVal: false }"
      :ui="{
        root: 'rounded-[7px] border border-gray-200 overflow-y-hidden',
        thead: 'bg-primary',
        th: 'text-white text-center!',
        td: 'text-center!',
      }"
      :columns="columns"
      class="flex-1">
      <template #is_active-cell="{ cell }">
        <UICBadge
          class="mx-auto"
          :value="cell.getValue() == true ? 'فعال' : 'غیرفعال'"
          :variant="cell.getValue() == false ? 'red' : 'green'"
          :custom-class="'px-4'" />
      </template>
    </UTable>
    <div v-if="showPagination" class="flex justify-center py-4">
      <UPagination
        v-model:page="pagination.pageIndex"
        :items-per-page="pagination.pageSize"
        :total="pagination.total"
        :default-page="1"
        :ui="{
          first: 'hidden',
          prev: 'scale-x-[-1]',
          next: 'scale-x-[-1]',
          last: 'hidden',
        }"
        @update:page="(p) => (page = p)" />
    </div>
  </div>
</template>
