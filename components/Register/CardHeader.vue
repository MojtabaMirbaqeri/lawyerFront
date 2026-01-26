<template>
  <div class="flex items-center justify-between w-full gap-3">
    <RegisterBackBtn :class="{ 'invisible pointer-events-none': useRegisterStore().formStep === 1 }" />
    <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex-1 text-center">
      {{ title }}
    </h1>
    <div
      class="w-9 lg:w-14 flex shrink-0"
      :class="{ 'invisible': useRegisterStore().formStep === 1 }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup>
defineProps(['title']);
</script>
