<script setup>
// import { h, resolveComponent } from "vue";
// import type { TableColumn } from "@nuxt/ui";

defineProps(["data", "columns"]);
</script>

<template>
  <UTable
    :data="data"
    :ui="{
      root: 'rounded-[7px]',
      thead: 'bg-primary',
      th: 'text-white text-center!',
      td: 'text-center!',
    }"
    :columns="columns"
    class="flex-1"
  >
    <template #is_active-cell="{ cell }">
      <UICBadge
        class="mx-auto"
        :value="cell.getValue() == true ? 'فعال' : 'غیرفعال'"
        :variant="cell.getValue() == false ? 'red' : 'green'"
        :custom-class="'px-4'"
      />
    </template>
  </UTable>
</template>