<template>
  <UBadge
    :icon="icon"
    :ui="{ leadingIcon: iconSize }"
    :class="`${customClass} font-bold w-fit flex items-center text-blue-500 bg-blue-100 rounded-full `"
    ><span class="text-[14px]">{{ value }}</span></UBadge
  >
</template>

<script setup>
defineProps(["value", "customClass", "icon", "iconSize"]);
</script>

<style>
</style>