<template>
  <div class="primary-box lg:mb-0">
    <h1 class="sec-header mb-3">اطلاعات نوبت</h1>
    <div class="boxes flex flex-col gap-2">
      <div class="info-box flex justify-between">
        <div class="title">مراجعه کننده</div>
        <div class="value">{{ useAuthStore().user.name + " " +  useAuthStore().user.family}}</div>
      </div>
      <div class="info-box flex justify-between">
        <div class="title">مدت زمان جلسه</div>
        <div class="value">{{ defTime }} دقیقه</div>
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
defineProps(['activeDay','defVisitTime','defTime'])
</script>

<style>
</style>