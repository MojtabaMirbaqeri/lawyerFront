<template>
  <section class="why-section">
    <div class="container">
      <div class="section-header">
        <h2 class="sec-header">
          چرا <span class="gradient-text">وکیل‌وکیل</span>؟
        </h2>
        <p class="section-subtitle">مزایای استفاده از پلتفرم ما</p>
      </div>
      
      <div class="benefits-grid">
        <div v-for="benefit in benefits" :key="benefit.id" class="benefit-card">
          <div class="benefit-icon" :style="{ background: benefit.gradient }">
            <UIcon :name="benefit.icon" class="size-7!" />
          </div>
          <h3 class="benefit-title">{{ benefit.title }}</h3>
          <p class="benefit-description">{{ benefit.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const benefits = [
  {
    id: 1,
    title: 'رزرو آنلاین آسان',
    description: 'در کمتر از ۲ دقیقه وقت مشاوره خود را رزرو کنید',
    icon: 'heroicons:calendar-days-solid',
    gradient: 'linear-gradient(135deg, #1e3a5f, #2d5a87)'
  },
  {
    id: 2,
    title: 'وکلای تخصصی تأیید شده',
    description: 'تمامی وکلا دارای پروانه وکالت و سابقه کار معتبر هستند',
    icon: 'heroicons:shield-check-solid',
    gradient: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    id: 3,
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی ما در تمام ساعات شبانه‌روز در خدمت شماست',
    icon: 'heroicons:chat-bubble-oval-left-ellipsis-solid',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  {
    id: 4,
    title: 'قیمت شفاف',
    description: 'هزینه مشاوره از قبل مشخص و بدون هزینه پنهان',
    icon: 'heroicons:currency-dollar-solid',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)'
  },
  {
    id: 5,
    title: 'امنیت اطلاعات',
    description: 'تمامی اطلاعات شما با رمزنگاری پیشرفته محافظت می‌شود',
    icon: 'heroicons:lock-closed-solid',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  },
  {
    id: 6,
    title: 'ضمانت بازگشت وجه',
    description: 'در صورت عدم رضایت، وجه شما بازگردانده می‌شود',
    icon: 'heroicons:arrow-path-solid',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)'
  }
];
</script>

<style scoped>
@reference "tailwindcss";

.why-section {
  @apply py-16 lg:py-20;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.section-header {
  @apply text-center mb-10 lg:mb-14;
}

.section-subtitle {
  @apply text-gray-500 text-base lg:text-lg mt-2;
}

.benefits-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8;
}

.benefit-card {
  @apply bg-white rounded-2xl p-6 lg:p-8 flex flex-col items-center text-center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.benefit-icon {
  @apply size-14 lg:size-16 rounded-2xl flex items-center justify-center text-white mb-5;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.benefit-title {
  @apply text-lg lg:text-xl font-bold text-gray-800 mb-2;
}

.benefit-description {
  @apply text-sm lg:text-base text-gray-500;
}

.gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
