<!-- eslint-disable vue/no-mutating-props -->
<script setup>
const props = defineProps(['value'])
</script>

<template>
  <UProgress v-model="props.value" />
</template>