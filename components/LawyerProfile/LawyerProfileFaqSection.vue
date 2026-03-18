<template>
  <LawyerProfileSectionCard
    section-id="faq"
    title="سوالات متداول">
    <UAccordion
      :items="faqItems"
      :ui="{
        root: 'space-y-2',
        item: 'rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden',
        trigger: 'px-4 py-3 text-sm font-semibold text-slate-800 gap-2',
        body: 'px-4 pb-4 pt-0 text-sm text-slate-600 leading-relaxed',
      }"
    />
  </LawyerProfileSectionCard>
</template>

<script setup>
const faqItems = [
  {
    label: "چگونه می‌توانم با وکیل مشاوره بگیرم؟",
    content:
      "با انتخاب نوع مشاوره (تلفنی، حضوری یا چت) و سپس زمان مناسب، رزرو را تکمیل و هزینه را آنلاین پرداخت کنید.",
  },
  {
    label: "آیا می‌توانم نظر خود را درباره وکیل ثبت کنم؟",
    content:
      "بله. پس از استفاده از خدمات، در بخش «امتیاز و دیدگاه کاربران» می‌توانید نظر و امتیاز خود را ثبت کنید.",
  },
];
</script>
