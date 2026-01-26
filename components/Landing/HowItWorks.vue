<template>
  <section class="how-section">
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="container relative z-10">
      <div class="section-header">
        <h2 class="sec-header">
          <span class="text-amber-400">مراحل</span> رزرو مشاوره
        </h2>
        <p class="section-subtitle">در ۴ قدم ساده به وکیل متخصص دسترسی پیدا کنید</p>
      </div>
      
      <div class="steps-container">
        <!-- Connecting Line (Desktop) -->
        <div class="steps-line">
          <div class="steps-line-progress"></div>
        </div>
        
        <div class="steps-grid">
          <div v-for="(step, index) in steps" :key="step.id" class="step-item group">
            <div class="step-card">
              <!-- Step Number -->
              <div class="step-badge">
                {{ index + 1 }}
              </div>
              
              <!-- Icon -->
              <div class="step-icon-wrapper">
                <UIcon :name="step.icon" class="size-8! text-white" />
              </div>
              
              <!-- Content -->
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    id: 1,
    title: 'انتخاب وکیل',
    description: 'وکیل مورد نظر خود را بر اساس تخصص و امتیاز انتخاب کنید',
    icon: 'heroicons:user-circle-solid'
  },
  {
    id: 2,
    title: 'انتخاب زمان',
    description: 'تاریخ و ساعت مناسب را برای مشاوره انتخاب کنید',
    icon: 'heroicons:clock-solid'
  },
  {
    id: 3,
    title: 'پرداخت امن',
    description: 'هزینه مشاوره را از درگاه امن پرداخت کنید',
    icon: 'heroicons:credit-card-solid'
  },
  {
    id: 4,
    title: 'دریافت مشاوره',
    description: 'در زمان تعیین شده مشاوره خود را دریافت کنید',
    icon: 'heroicons:chat-bubble-left-right-solid'
  }
];
</script>

<style scoped>
@reference "tailwindcss";

.how-section {
  @apply py-20 lg:py-24 relative overflow-hidden;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
}

.blob {
  @apply absolute rounded-full opacity-10;
  filter: blur(80px);
}

.blob-1 {
  @apply w-[500px] h-[500px] -top-20 -end-20;
  background: #f59e0b; /* Gold glow */
}

.blob-2 {
  @apply w-[400px] h-[400px] -bottom-20 -start-20;
  background: #3b82f6; /* Blue glow */
}

.section-header {
  @apply text-center mb-16;
}

.section-header .sec-header {
  @apply text-white text-3xl lg:text-4xl font-bold;
}

.section-subtitle {
  @apply text-gray-300 text-lg mt-3;
}

.steps-container {
  @apply relative;
}

.steps-line {
  @apply hidden lg:block absolute top-[50%] start-0 w-full h-0.5 -translate-y-1/2 z-0;
  background: rgba(255, 255, 255, 0.1);
}

.steps-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10;
}

.step-card {
  @apply flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.step-item:hover .step-card {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-8px);
  border-color: rgba(245, 158, 11, 0.3); /* Gold border on hover */
}

.step-badge {
  @apply absolute -top-4  size-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg;
  background: #f59e0b; /* Gold */
  color: #1e3a5f; /* Navy text */
  border: 2px solid #1e3a5f;
}

.step-icon-wrapper {
  @apply size-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border: 1px solid rgba(255,255,255,0.1);
}

.step-item:hover .step-icon-wrapper {
  transform: scale(1.1) rotate(3deg);
  background: linear-gradient(135deg, #f59e0b, #d97706); /* Gold gradient on hover */
}

.step-title {
  @apply text-xl font-bold text-white mb-3;
}

.step-description {
  @apply text-sm text-gray-400 leading-relaxed;
}
</style>
