<template>
  <div id="booking-card" class="space-y-4">
    <InfoLawyerChooseVisit
      :active="lawyer?.is_active"
      :items="items"
      :lawyer-name="fullName"
      :phone-number="lawyer?.phone"
      :lawyer-id="lawyer?.id"
      :has-working-hours="hasWorkingHours" />

    <div class="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600">
      <p class="font-semibold text-slate-800">رزرو آنلاین و سریع</p>
      <p class="mt-1">امکان لغو طبق قوانین سامانه</p>
      <p class="mt-1">در صورت نیاز، ابتدا پرسش حقوقی ثبت کنید</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lawyer: { type: Object, required: true },
  fullName: { type: String, required: true },
  items: { type: Array, default: () => [] },
  hasWorkingHours: { type: Boolean, default: false },
});
</script>
