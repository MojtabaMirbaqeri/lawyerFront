<template>
  <UModal :title="title">
    <UButton icon="stash:image-search" color="neutral" variant="link" class="" :ui="{leadingIcon:'size-6!'}"/>

    <template #body>
        <NuxtImg class="w-full" :src="image" alt=""/>
    </template>
  </UModal>
</template>

<script setup>
defineProps(["image", "title"]);
</script>