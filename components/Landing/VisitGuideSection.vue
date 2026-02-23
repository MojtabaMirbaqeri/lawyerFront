<template>
  <section id="visit-guide" class="visit-guide-section">
    <!-- Section Header -->
    <div class="section-header">
      <h2 class="sec-header">
        <span class="gradient-text">راهنمای</span> مشاوره آنلاین
      </h2>
      <p class="section-subtitle">با چند گام ساده به بهترین وکلای کشور دسترسی پیدا کنید</p>
    </div>
    
    <div class="guide-con">
      <div class="space-y-2.5">
        <div class="info-banner">
          <UIcon
            name="heroicons:information-circle-solid"
            class="align-middle me-1 size-5! text-indigo-500"
          />
          برای مشاهده جزئیات هر شیوه مشاوره روی آن کلیک کنید
        </div>
        <div>
          <UICSelectButton
            v-model="visitType"
            :items="filteredVisitTypes"
            :ui="{
              base: 'text-black bg-white rounded-lg',
            }"
          />
        </div>
      </div>
      <hr class="text-gray-200" />
      <div class="space-y-2.5">
        <h3 class="guide-description">در چت وکیل در فضای چت از طریق پیام به شما مشاوره می دهد</h3>
        <UAccordion
          :items="items"
          :ui="{
            root: 'space-y-3 lg:space-y-4',
            item: 'border-b-0 bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow',
            trigger: 'text-base px-4 py-3.5 lg:p-4 gap-3 lg:text-lg font-medium',
            body: 'text-base p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 whitespace-break-spaces border-t border-gray-100',
          }"
        >
          <template #leading="{ item }">
            <div class="icon-wrapper">
              <UIcon
                :name="item?.icon"
                class="absolute -translate-1/2 top-1/2 end-1/2 size-5! lg:size-5.5! text-white"
              />
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
  </section>
</template>

<script setup>
const { visitTypes } = useFiltersStore();

const filteredVisitTypes = visitTypes.filter((item) => item.id !== "inperson");
const visitType = ref(filteredVisitTypes[1].id);

const items = ref([
  {
    label: "ثبت درخواست مشاوره ",
    content: `💠 نوع خدمات حقوقی و وکیل مورد نظر خود را انتخاب کنید.

💠 در بخش شرح درخواست، موضوع مشکل حقوقی خود را به‌صورت کوتاه، دقیق و شفاف بنویسید.

💠 تاریخ و ساعت موردنظر برای مشاوره یا شروع گفت‌وگو را مشخص کنید.

💠 اگر دارای بیمه حقوقی یا قرارداد مشاوره‌ای هستید، اطلاعات مربوط را وارد نمایید.

💠 کد تخفیف دارید؟ وارد کرده و فعال‌سازی کنید.
`,
    icon: "solar:document-add-linear",
  },
  {
    label: "پرداخت موفق و انتظار",
    content: `💠 بعد از ثبت درخواست و پرداخت موفق، اطلاعات مربوط به پرونده حقوقی خود را تکمیل کنید.

💠 پس از تکمیل اطلاعات، امکان شروع گفت‌وگو با وکیل برای شما فعال می‌شود.

💠 در مشاوره متنی، پاسخ‌گویی حداکثر تا ۱۰ ساعت انجام می‌شود، اما بسیاری از وکلا زودتر پاسخ می‌دهند.

💠 میانگین زمان پاسخ‌گویی هر وکیل را در پروفایل او می‌توانید مشاهده کنید.
`,
    icon: "solar:wallet-money-outline",
  },
  {
    label: "نوع مشاوره: چت",
    content: `💠 وکیل پاسخ شما را در زمان مقرر، از طریق چت و به‌صورت متنی ارسال می‌کند.

💠 در صورت داشتن مستندات مرتبط مانند قرارداد، اظهارنامه، دادخواست یا سایر مدارک حقوقی، می‌توانید آن‌ها را در فضای چت برای وکیل ارسال کنید.`,
    icon: "solar:chat-line-linear",
  },
  {
    label: "خاتمه مشاوره",
    content: `💠 مشاوره حقوقی با هماهنگی شما و توسط وکیل پایان داده می‌شود.

💠 اگر مشاوره بدون اطلاع شما به پایان رسید، با پشتیبانی حقوقی ما تماس بگیرید.

💠 هر مشاوره باید روی یک موضوع مشخص حقوقی متمرکز باشد. برای طرح موضوع جدید، مشاوره‌ی جداگانه‌ای ثبت کنید.

💠 اطلاعات تمام مشاوره‌های شما در بخش «گفت‌وگوهای من» ذخیره می‌شود.

💠 نظرتان درباره مشاوره را ثبت کنید؛ این بازخورد به سایر کاربران در انتخاب بهتر وکیل کمک می‌کند.`,
    icon: "solar:alarm-outline",
  },
]);
</script>

<style scoped>
@reference "tailwindcss";

.visit-guide-section {
  @apply relative py-4;
}

.section-header {
  @apply text-center mb-6;
}

.section-subtitle {
  @apply text-gray-600 text-sm lg:text-base mt-1;
}

.guide-con {
  @apply rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-gray-100 space-y-4;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.info-banner {
  @apply flex items-center gap-1 text-gray-600 bg-white/80 rounded-xl px-4 py-2.5 text-sm lg:text-base;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.guide-description {
  @apply text-gray-700 font-medium;
}

.icon-wrapper {
  @apply size-10 lg:size-11 relative rounded-xl;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
