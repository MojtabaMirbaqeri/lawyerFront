<script setup>
const page = ref(1);
</script>

<template>
  <UPagination
    v-model:page="page"
    :show-controls="true"
    show-edges
    :total="80"
    :items-per-page="15"
    :sibling-count="1"
    :ui="{
      first: 'hidden',
      prev: 'scale-x-[-1]',
      next: 'scale-x-[-1]',
      last: 'hidden',
    }"
  />
</template>
