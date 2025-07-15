<template>
  <UDrawer title="comment" class="" :ui="{ content: 'lg:w-[40%]! mx-auto' }">
    <slot name="button" />

    <template #content>
      <div class="p-4 lg:p-8">
        <slot />
      </div>
    </template>
  </UDrawer>
</template>

<script>
export default {};
</script>

<style>
</style>