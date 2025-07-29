<template>
  <div class="relative h-[100vh] flex justify-center items-center">
    <div class="form w-full">
      <section class="px-2">
        <div
          class="primary-box p-6 mx-auto w-full"
          :style="{ maxWidth: '450px' }"
        >
        <slot/>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped></style>