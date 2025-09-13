<!-- eslint-disable vue/no-parsing-error -->
<template>
  <section class="grid grid-cols-1 gap-4 lg:gap-8">
    <div class="ds-table-con">
      <h2>شما {{comProfile}} درصد پروفایل خود را تکمیل کرده اید.</h2>
      <UICProgressBar :value="comProfile" class="mb-2 lg:mb-4"/>
      <DashboardLawyerDetailBox/>
    </div>
    
  </section>
</template>

<script setup>
const comProfile = ref(80)
</script>