<template>
  <UFormField
    :label="label"
    :name="name"
    class="w-full flex flex-col gap-3 text-[15px]"
    :ui="{ error: 'absolute right-0 text-sm mt-1' }"
  >
    <UInput
      v-model="state"
      class="w-full"
      :ui="{ root: 'h-[46px]', base: 'h-full' }"
    />
  </UFormField>
</template>

<script setup>
defineProps(['name','label'])
const state = defineModel()
</script>

<style>
</style>