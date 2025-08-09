<script setup>
const props = defineProps(["items"]);
const value = defineModel({ default: 1 });
// console.log(props.items[0].id);
</script>

<template>
  <USelect
    v-model="value"
    value-key="id"
    :items="items"
    class="field-base"
  />
</template>
