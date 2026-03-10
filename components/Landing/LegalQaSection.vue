<template>
  <section id="legal-qa" class="legal-qa-section">
    <div class="qa-capsule">
      <!-- Background Elements -->
      <div class="qa-bg">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="grid-pattern"></div>
      </div>

      <div class="qa-wrap relative z-10">
        <!-- Left: Intro + Steps + CTA -->
        <div class="qa-intro">
          <div class="qa-badge">
            <UIcon name="heroicons:chat-bubble-left-right-solid" class="size-4!" />
            سوال بپرسید، پاسخ بگیرید
          </div>
          
          <h2 class="qa-heading">
            پرسش و پاسخ <span class="highlight-text">حقوقی</span>
          </h2>
          
          <p class="qa-desc">
            سوال خود را ثبت کنید؛ وکلای متخصص پاسخ می‌دهند. پاسخ‌ها را بخوانید و در صورت نیاز مشاوره رزرو نمایید.
          </p>
          
          <ul class="qa-steps-list">
            <li v-for="(step, i) in steps" :key="step.id" class="qa-step-item">
              <div class="step-icon-wrap">
                <UIcon :name="step.icon" class="step-icon size-5!" />
              </div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
            </li>
          </ul>
          
          <div class="qa-actions">
            <NuxtLink to="/legal/ask" class="qa-btn qa-btn--primary">
              ثبت سوال جدید
              <UIcon name="heroicons:arrow-left-solid" class="size-4!" />
            </NuxtLink>
            <NuxtLink to="/legal/questions" class="qa-btn qa-btn--secondary">
              مشاهده پرسش‌ها
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Questions Cards -->
        <div class="qa-feed">
          <div class="qa-feed-header">
            <h3 class="qa-feed-title">آخرین پرسش‌های <span class="text-amber-400">کاربران</span></h3>
          </div>

          <div v-if="pending" class="qa-cards-container">
            <div v-for="i in 3" :key="i" class="qa-card qa-card--skeleton">
              <div class="flex items-center gap-3 w-full">
                <USkeleton class="h-10 w-10 rounded-xl shrink-0" />
                <div class="flex-1 space-y-2">
                  <USkeleton class="h-4 w-3/4" />
                  <USkeleton class="h-3 w-1/2" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="!questions.length" class="qa-empty-state">
            <UIcon name="heroicons:document-text-solid" class="size-12 text-slate-500 mb-3" />
            <p class="text-slate-300 font-medium">{{ error ? 'خطا در دریافت اطلاعات.' : 'هنوز پرسشی ثبت نشده است.' }}</p>
            <NuxtLink to="/legal/ask" class="qa-btn qa-btn--primary !py-2 !px-4 !text-sm mt-3">اولین پرسش را ثبت کنید</NuxtLink>
          </div>

          <div v-else class="qa-cards-container">
            <NuxtLink 
              v-for="(q, i) in questions.slice(0, 4)" 
              :key="q.id"
              :to="`/legal/questions/${q.slug || q.id}`" 
              class="qa-card group">
              <div class="qa-card-icon">
                <UIcon name="heroicons:question-mark-circle-solid" class="size-5! text-amber-400" />
              </div>
              <div class="qa-card-content">
                <h4 class="qa-card-title">{{ q.title }}</h4>
                <div class="qa-card-meta">
                  <span class="meta-item">
                    <UIcon name="heroicons:chat-bubble-bottom-center-text-solid" class="size-3.5!" />
                    {{ q.answers_count ?? 0 }} پاسخ וکیل
                  </span>
                </div>
              </div>
              <div class="qa-card-arrow relative overflow-hidden">
                <UIcon name="heroicons:arrow-left-solid" class="size-4! text-white/50 group-hover:text-amber-400 transition-colors" />
              </div>
            </NuxtLink>
          </div>
          
          <div class="mt-6 text-center">
             <NuxtLink to="/legal/questions" class="view-all-link">
              مشاهده همه پرسش و پاسخ‌ها
              <UIcon name="heroicons:arrow-left-solid" class="size-4!" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { id: 1, title: 'ثبت سوال حقوقی', desc: 'مشکل خود را مطرح کنید', icon: 'heroicons:pencil-square-solid' },
  { id: 2, title: 'بررسی توسط وکلا', desc: 'پاسخ تخصصی دریافت کنید', icon: 'heroicons:magnifying-glass-circle-solid' },
  { id: 3, title: 'رزرو مشاوره', desc: 'در صورت نیاز به پیگیری', icon: 'heroicons:phone-solid' },
];

const questions = ref([]);
const pending = ref(true);
const error = ref(false);

async function fetchQuestions() {
  pending.value = true;
  error.value = false;
  const res = await useGet(
    { url: 'legal/questions', query: { per_page: 4, sort: 'newest' }, includeAuthHeader: false },
    false
  );
  pending.value = false;
  if (res.status && res.data) {
    const data = res.data?.data ?? res.data;
    questions.value = Array.isArray(data) ? data : [];
  } else {
    error.value = true;
    questions.value = [];
  }
}

onMounted(() => fetchQuestions());
</script>

<style scoped>
@reference "tailwindcss";

.legal-qa-section {
  @apply py-0 lg:py-0;
}

.qa-capsule {
  @apply relative overflow-hidden w-full;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e293b 100%);
}

.qa-bg {
  @apply absolute inset-0 overflow-hidden pointer-events-none;
}

.blob {
  @apply absolute rounded-full opacity-30;
  filter: blur(80px);
}

.blob-1 {
  @apply w-[400px] h-[400px] -top-20 -end-20;
  background: linear-gradient(135deg, #1e3a5f, #fbbf24);
  animation: blob-float 8s ease-in-out infinite;
}

.blob-2 {
  @apply w-[300px] h-[300px] -bottom-20 -start-20;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  animation: blob-float 10s ease-in-out infinite 2s;
}

@keyframes blob-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
}

.grid-pattern {
  @apply absolute inset-0 opacity-[0.04];
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.qa-wrap {
  @apply grid grid-cols-1 lg:grid-cols-2 lg:gap-8 items-center;
}

/* --- Left Column --- */
.qa-intro {
  @apply p-8 lg:p-12 xl:p-16 flex flex-col justify-center;
}

.qa-badge {
  @apply inline-flex items-center w-fit gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-400 mb-6;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.qa-heading {
  @apply text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight;
}

.highlight-text {
  @apply text-transparent bg-clip-text;
  background-image: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.qa-desc {
  @apply text-slate-300 text-sm lg:text-base leading-relaxed mb-8 max-w-lg;
}

.qa-steps-list {
  @apply list-none p-0 m-0 mb-10 space-y-4;
}

.qa-step-item {
  @apply flex items-center gap-4 p-3 rounded-2xl transition-colors;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.qa-step-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.step-icon-wrap {
  @apply flex items-center justify-center size-12 rounded-xl text-white shrink-0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
}

.step-content {
  @apply flex flex-col;
}

.step-title {
  @apply text-white font-semibold text-sm lg:text-base mb-0.5;
}

.step-desc {
  @apply text-slate-400 text-xs;
}

.qa-actions {
  @apply flex flex-wrap gap-4 mt-2;
}

.qa-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold no-underline transition-all duration-300;
}

.qa-btn--primary {
  @apply text-[#1e3a5f];
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.qa-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.qa-btn--secondary {
  @apply text-white;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.qa-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

/* --- Right Column: Feed --- */
.qa-feed {
  @apply flex flex-col p-8 lg:p-12 xl:p-16 h-full relative z-10;
}

.qa-feed::before {
  content: '';
  @apply absolute inset-y-8 start-0 hidden lg:block;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  width: 1px;
}

.qa-feed-header {
  @apply flex items-center justify-between mb-6 relative z-10;
}

.qa-feed-title {
  @apply text-xl font-bold text-white;
}

.qa-cards-container {
  @apply flex flex-col gap-3 relative z-10;
}

.qa-card {
  @apply flex items-start sm:items-center gap-4 p-4 rounded-2xl no-underline transition-all duration-300 relative overflow-hidden;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.qa-card:hover {
  transform: translateY(-3px) scale(1.01);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.qa-card::before {
  content: '';
  @apply absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none;
  background: linear-gradient(135deg, rgba(245,158,11,0.05), transparent);
}

.qa-card:hover::before {
  @apply opacity-100;
}

.qa-card-icon {
  @apply flex items-center justify-center size-10 rounded-full shrink-0 mt-1 sm:mt-0;
  background: rgba(245, 158, 11, 0.1);
}

.qa-card-content {
  @apply flex-1 min-w-0 flex flex-col gap-1.5;
}

.qa-card-title {
  @apply text-white font-medium text-sm lg:text-base leading-snug line-clamp-2 transition-colors;
}

.qa-card:hover .qa-card-title {
  @apply text-amber-300;
}

.qa-card-meta {
  @apply flex items-center gap-3;
}

.meta-item {
  @apply flex items-center gap-1.5 text-xs text-slate-400 font-medium;
}

.qa-card-arrow {
  @apply flex items-center justify-center size-8 rounded-full bg-white/5 shrink-0 transition-transform duration-300 mt-2 sm:mt-0;
}

.qa-card:hover .qa-card-arrow {
  @apply bg-amber-400/20;
  transform: translateX(-4px);
}

.qa-card--skeleton {
  @apply cursor-default border-dashed border-white/5;
}
.qa-card--skeleton:hover {
  @apply transform-none bg-white/5 border-white/5 shadow-none;
}
.qa-card--skeleton::before {
  @apply hidden;
}

.qa-empty-state {
  @apply flex flex-col items-center justify-center py-12 px-6 text-center bg-white/5 rounded-2xl border border-dashed border-white/10 relative z-10;
}

.view-all-link {
  @apply inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 relative z-10 mt-2;
}
</style>
