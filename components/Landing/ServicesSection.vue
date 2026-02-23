<template>
  <section class="services-section">
    <div class="container">
      <div class="section-header">
        <h2 class="sec-header">
          <span class="gradient-text">خدمات</span> مشاوره حقوقی
        </h2>
        <p class="section-subtitle">روش مشاوره مورد نظر خود را انتخاب کنید</p>
      </div>
      
      <div class="services-grid">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="service-card"
          :class="{ 'service-card--featured': service.featured, 'service-card--coming-soon': service.comingSoon }"
          @click="!service.comingSoon && selectService(service.id)">
          <div class="service-icon" :style="{ background: service.gradient }">
            <UIcon :name="service.icon" class="size-8!" />
          </div>
          <h3 class="service-title">{{ service.title }}</h3>
          <p class="service-description">{{ service.description }}</p>
          <!-- <div class="service-price">
            <span class="price-from">شروع از</span>
            <span class="price-value">{{ service.price }}</span>
            <span class="price-unit">تومان</span>
          </div> -->
          <div class="service-features">
            <div v-for="feature in service.features" :key="feature" class="feature-item">
              <UIcon name="heroicons:check-circle-solid" class="size-4! text-green-500" />
              <span>{{ feature }}</span>
            </div>
          </div>
          <button type="button" class="service-btn" :disabled="service.comingSoon" :aria-label="service.comingSoon ? 'به زودی' : 'انتخاب ' + service.title">
            {{ service.comingSoon ? 'به زودی' : 'انتخاب' }}
            <UIcon v-if="!service.comingSoon" name="heroicons:arrow-left-solid" class="size-4!" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  {
    id: 'chat',
    title: 'مشاوره چت',
    description: 'گفتگوی متنی با وکیل در هر ساعت از شبانه‌روز',
    icon: 'heroicons:chat-bubble-left-right-solid',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    price: '50,000',
    featured: false,
    features: ['پاسخ تا ۱۰ ساعت', 'ارسال مدارک', 'ذخیره مکالمات']
  },
  {
    id: 'phone',
    title: 'مشاوره تلفنی',
    description: 'تماس صوتی مستقیم با وکیل متخصص',
    icon: 'heroicons:phone-solid',
    gradient: 'linear-gradient(135deg, #1e3a5f, #2d5a87)',
    price: '80,000',
    featured: true,
    features: ['پاسخ فوری', 'مکالمه ۳۰ دقیقه‌ای', 'ضبط مکالمه']
  },
  {
    id: 'video',
    title: 'مشاوره ویدیویی',
    description: 'جلسه ویدیویی آنلاین با وکیل',
    icon: 'heroicons:video-camera-solid',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    price: '120,000',
    featured: false,
    comingSoon: true,
    features: ['جلسه ۴۵ دقیقه‌ای', 'اشتراک صفحه', 'ضبط جلسه']
  },
  {
    id: 'inperson',
    title: 'مشاوره حضوری',
    description: 'ملاقات حضوری در دفتر وکیل',
    icon: 'heroicons:building-office-2-solid',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    price: '200,000',
    featured: false,
    features: ['جلسه ۶۰ دقیقه‌ای', 'بررسی اسناد', 'مشاوره تخصصی']
  }
];

const selectService = (id) => {
  navigateTo(`/lawyers?service=${id}`);
};
</script>

<style scoped>
@reference "tailwindcss";

.services-section {
  @apply py-16 lg:py-20;
}

.section-header {
  @apply text-center mb-10 lg:mb-14;
}

.section-subtitle {
  @apply text-gray-600 text-base lg:text-lg mt-2;
}

.services-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

.service-card {
  @apply relative bg-white rounded-3xl p-6 lg:p-8 flex flex-col items-center text-center cursor-pointer;
  border: 2px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.service-card--featured {
  border-color: #1e3a5f;
  background: linear-gradient(135deg, rgba(30, 58, 95, 0.04) 0%, rgba(45, 90, 135, 0.03) 100%);
}

.service-card--featured::before {
  content: 'پرطرفدار';
  @apply absolute -top-3 end-4 px-3 py-1 text-xs font-bold text-[#1e3a5f] rounded-full;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.service-card--coming-soon::before {
  content: 'به زودی';
  @apply absolute -top-3 end-4 px-3 py-1 text-xs font-bold text-white rounded-full;
  background: linear-gradient(135deg, #94a3b8, #64748b);
}

.service-card--coming-soon {
  @apply opacity-95;
}

.service-card--coming-soon .service-btn:disabled {
  @apply cursor-not-allowed opacity-80;
}

.service-icon {
  @apply size-16 lg:size-20 rounded-2xl flex items-center justify-center text-white mb-4;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.service-title {
  @apply text-xl lg:text-2xl font-bold text-gray-800 mb-2;
}

.service-description {
  @apply text-sm text-gray-500 mb-4;
}

.service-price {
  @apply flex items-baseline gap-1 mb-4;
}

.price-from {
  @apply text-xs text-gray-400;
}

.price-value {
  @apply text-2xl font-black text-[#1e3a5f];
}

.price-unit {
  @apply text-sm text-gray-500;
}

.service-features {
  @apply space-y-2 mb-6 w-full;
}

.feature-item {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.service-btn {
  @apply w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2;
  background: #1e3a5f;
  box-shadow: 0 4px 15px rgba(30, 58, 95, 0.35);
  transition: all 0.3s ease;
}

.service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(30, 58, 95, 0.45);
  background: #2d5a87;
}

.gradient-text {
  background: linear-gradient(135deg, #1e3a5f, #2d5a87);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
