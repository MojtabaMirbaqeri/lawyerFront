<template>
  <section id="faq" class="faq-section">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="sec-header">
        <span class="gradient-text">سوالات</span> متداول
      </h2>
      <p class="section-subtitle">پاسخ به پرسش‌های رایج درباره خدمات مشاوره حقوقی</p>
    </div>
    
    <UAccordion
      :items="faqItems"
      :ui="{
        root: 'space-y-3 lg:space-y-4',
        item: 'bg-white border border-gray-100 rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300',
        trigger: 'text-base px-4 py-4 lg:p-5 gap-3 lg:text-lg font-medium hover:bg-gray-50/50',
        body: 'text-base p-4 lg:p-5 bg-gradient-to-br from-[#1e3a5f]/5 to-[#1e3a5f]/10 whitespace-break-spaces border-t border-gray-100',
      }"
    >
      <template #leading="{ index }">
        <div class="faq-number">
          {{ index + 1 }}
        </div>
      </template>
    </UAccordion>
  </section>
</template>

<script setup>
const faqItems = [
  {
    label: "مدت زمان هر مشاوره چقدر است؟",
    content: `💠 مدت زمان مشاوره بسته به نوع خدمت انتخابی متفاوت است، اما معمولاً بین ۲۰ تا ۴۵ دقیقه زمان اختصاص داده می‌شود.

💠 در صورت نیاز به زمان بیشتر، امکان تمدید جلسه با هماهنگی وکیل وجود دارد.`,
  },
  {
    label: "چه مدارکی باید ارسال کنیم؟",
    content: `💠 هر نوع مدرک مرتبط با موضوع مشاوره، مانند قرارداد، نامه رسمی، پیامک‌ها یا تصاویر مدارک شناسایی می‌تواند مفید باشد.

💠 وکیل در صورت نیاز، لیست دقیق‌تری از مدارک را از شما درخواست خواهد کرد.`,
  },
  {
    label: "آیا امکان تغییر زمان مشاوره وجود دارد؟",
    content: `💠 بله، تا ۲ ساعت قبل از زمان تعیین‌شده، امکان تغییر یا لغو مشاوره از طریق پنل کاربری یا پشتیبانی وجود دارد.

💠 پس از آن، تغییر زمان فقط با تایید وکیل ممکن است.`,
  },
  {
    label: "در صورت نارضایتی از مشاوره چه باید کرد؟",
    content: `💠 در صورتی که از روند یا محتوای مشاوره رضایت نداشتید، می‌توانید موضوع را از طریق پشتیبانی پیگیری کرده و درخواست بررسی مجدد ثبت کنید.

💠 ما کیفیت خدمات و رضایت کاربران را در اولویت قرار می‌دهیم.`,
  },
];
</script>

<style scoped>
@reference "tailwindcss";

.faq-section {
  @apply relative py-16 lg:py-20;
}

.section-header {
  @apply text-center mb-10;
}

.section-subtitle {
  @apply text-gray-500 text-base lg:text-lg mt-2;
}

.faq-number {
  @apply size-8 lg:size-9 flex items-center justify-center rounded-lg text-[#1e3a5f] font-bold text-sm lg:text-base;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
