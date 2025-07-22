<template>
  <div class="primary-box mb-[120px] lg:mb-0">
    <h1 class="sec-header mb-3">اطلاعات نوبت</h1>
    <div class="boxes flex flex-col gap-2">
      <div class="info-box flex justify-between">
        <div class="title">مراجعه کننده</div>
        <div class="value">محمد طاها حاجی عبداللهی</div>
      </div>
      <div class="info-box flex justify-between">
        <div class="title">نوع نوبت</div>
        <div class="value">نوبت ویزیت در مطب</div>
      </div>
      <div class="info-box flex justify-between">
        <div class="title">تاریخ نوبت</div>
        <div class="value">
          {{ new Date(activeDay).toLocaleDateString("fa") }}
        </div>
      </div>
      <div class="info-box flex justify-between">
        <div class="title">ساعت</div>
        <div class="value">{{ defVisitTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['activeDay','defVisitTime'])
</script>

<style>
</style>