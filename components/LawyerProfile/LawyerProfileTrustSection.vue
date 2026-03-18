<template>
  <LawyerProfileSectionCard
    section-id="trust"
    title="اعتماد و شفافیت">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <p class="text-xs text-slate-500">وضعیت پروفایل</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">
          {{ isVerified ? "تایید شده" : "تکمیل‌شده توسط وکیل" }}
        </p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <p class="text-xs text-slate-500">امتیاز کاربران</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">{{ rateDisplay }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <p class="text-xs text-slate-500">تعداد دیدگاه</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">{{ reviewCount }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <p class="text-xs text-slate-500">سابقه فعالیت</p>
        <p class="mt-1 text-sm font-semibold text-slate-800">{{ years }} سال</p>
      </div>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({
  isVerified: { type: Boolean, default: false },
  rateDisplay: { type: String, default: "—" },
  reviewCount: { type: Number, default: 0 },
  years: { type: Number, default: 0 },
});
</script>
