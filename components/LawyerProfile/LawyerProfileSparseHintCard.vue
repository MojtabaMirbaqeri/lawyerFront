<template>
  <div
    v-if="show"
    class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
    اطلاعات تکمیلی این پروفایل هنوز ثبت نشده است.
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
});
</script>
