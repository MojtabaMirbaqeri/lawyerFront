<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="qa"
    title="پاسخ‌های حقوقی این وکیل"
    subtitle="نمونه‌ای از پاسخ‌های ثبت‌شده توسط این وکیل">
    <div class="space-y-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-xl border border-slate-200 p-4 text-sm text-slate-700">
        {{ item.question }}
      </article>
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
      <UICSecondaryBtn>مشاهده همه پاسخ‌ها</UICSecondaryBtn>
      <UICMainBtn>ثبت پرسش حقوقی</UICMainBtn>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
});
</script>
