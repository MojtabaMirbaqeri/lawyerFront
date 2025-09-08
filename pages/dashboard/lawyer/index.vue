<!-- eslint-disable vue/no-parsing-error -->
<template>
  <section>
    <div class="bg-white p-4 rounded-[8px]">
      <h2>شما {{comProfile}} درصد پروفایل خود را تکمیل کرده اید.</h2>
      <UICProgressBar :value="comProfile" class="p-4 md:p-6"/>
      <DashboardLawyerDetailBox/>
    </div>
  </section>
</template>

<script setup>
const comProfile = ref(80)
</script>