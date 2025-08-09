<template>
  <button
    class="main-btn"
    :class="{ 'cursor-no-drop opacity-80 border-gray-300': disabled }"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps(["disabled"]);
</script>

<style scoped></style>