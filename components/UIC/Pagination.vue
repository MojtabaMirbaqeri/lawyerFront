<script setup>
const page = defineModel({ default: 1, type: Number });

defineProps(["total", "pageSize"]);
</script>

<template>
  <UPagination
    v-model:page="page"
    :show-controls="true"
    show-edges
    :total="total"
    :items-per-page="pageSize"
    :sibling-count="1"
    :ui="{
      first: 'hidden',
      prev: 'scale-x-[-1]',
      next: 'scale-x-[-1]',
      last: 'hidden',
    }"
  />
</template>
