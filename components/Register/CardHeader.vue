<template>
  <div class="flex justify-between items-center w-full">
    <RegisterBackBtn :class="{ 'hidden!': useRegisterStore().formStep == 1 }" />
    <h1 class="sec-header mx-auto">{{ title }}</h1>
    <div
      class="w-9 lg:w-20"
      :class="{ 'hidden!': useRegisterStore().formStep == 1 }"
    />
  </div>
</template>
<script setup>
defineProps(["title"]);
</script>