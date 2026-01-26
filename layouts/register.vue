<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Left: Branding (desktop) -->
    <aside
      class="hidden lg:flex lg:flex-1 relative min-h-screen flex-col items-center justify-center p-10 xl:p-14 overflow-hidden"
      style="background: linear-gradient(165deg, #1e3a5f 0%, #152a45 50%, #0f1f33 100%);">
      <!-- Decorative -->
      <div class="absolute top-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl translate-x-1/3 translate-y-1/3" />
      <div class="absolute top-1/2 right-0 w-px h-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div class="relative z-10 text-center max-w-md flex flex-col items-center">
        <!-- Vector: shield + check (امنیت) — از SVG Repo -->
        <img
          src="https://www.svgrepo.com/show/372657/shield-check.svg"
          alt=""
          class="w-24 h-24 xl:w-28 xl:h-28 shrink-0 mb-6 brightness-0 invert opacity-40"
          aria-hidden="true"
          loading="eager"
        />
        <NuxtLink
          to="/"
          class="inline-block text-2xl xl:text-3xl font-bold text-white tracking-tight hover:text-white/90 transition">
          وکیل وکیل
        </NuxtLink>
        <p class="mt-3 text-slate-300/90 text-sm xl:text-base leading-relaxed">
          ورود و ثبت‌نام امن در سامانه مشاوره حقوقی
        </p>
        <ul class="mt-8 space-y-3 text-start w-full">
          <li class="flex items-center gap-3 text-slate-300/80 text-sm">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <UIcon name="solar:shield-check-linear" class="size-4 text-white" />
            </span>
            ورود با رمز یک‌بار مصرف
          </li>
          <li class="flex items-center gap-3 text-slate-300/80 text-sm">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <UIcon name="solar:phone-call-linear" class="size-4 text-white" />
            </span>
            پشتیبانی در تمام مراحل
          </li>
          <li class="flex items-center gap-3 text-slate-300/80 text-sm">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <UIcon name="solar:document-text-linear" class="size-4 text-white" />
            </span>
            رزرو مشاوره آنلاین
          </li>
        </ul>
        <NuxtLink
          to="/"
          class="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <UIcon name="solar:arrow-right-linear" class="size-4 rotate-180" />
          بازگشت به سایت
        </NuxtLink>
      </div>
    </aside>

    <!-- Right: Form -->
    <div
      class="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);"
    >
      <!-- Subtle decorative orbs -->
      <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#1e3a5f]/[0.04] blur-3xl pointer-events-none" />
      <div class="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-[#1e3a5f]/[0.03] blur-3xl pointer-events-none" />

      <!-- Vector: سند — از SVG Repo (پس‌زمینه دسکتاپ) -->
      <img
        src="https://www.svgrepo.com/show/494331/document.svg"
        alt=""
        class="absolute top-8 right-8 w-48 h-auto opacity-[0.06] hidden lg:block pointer-events-none"
        aria-hidden="true"
      />
      <!-- Vector: ترازوی عدالت — از SVG Repo -->
      <img
        src="https://www.svgrepo.com/show/404465/balance-scale-court-justice-scale-law-legal.svg"
        alt=""
        class="absolute bottom-12 left-8 w-32 h-32 opacity-[0.06] hidden lg:block pointer-events-none"
        aria-hidden="true"
      />

      <!-- Mobile: compact branding + vector -->
      <div class="lg:hidden mb-5 text-center relative z-10 flex flex-col items-center">
        <NuxtLink to="/" class="text-xl font-bold text-[#1e3a5f] hover:opacity-90 transition">
          وکیل وکیل
        </NuxtLink>
        <p class="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
          <!-- وکتور قفل از SVG Repo -->
          <img
            src="https://www.svgrepo.com/show/469159/lock.svg"
            alt=""
            class="w-4 h-4 shrink-0 opacity-70"
            aria-hidden="true"
          />
          ورود و ثبت‌نام
        </p>
      </div>

      <div class="w-full max-w-[420px] sm:max-w-[450px] relative z-10">
        <div
          class="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm max-h-[85vh] overflow-auto"
          style="box-shadow: 0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px -2px rgba(0,0,0,0.04), 0 12px 24px -6px rgba(30,58,95,0.08), 0 24px 48px -12px rgba(30,58,95,0.12);"
        >
          <!-- Soft top accent (replaces harsh line) -->
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1e3a5f]/25 to-transparent" />
          <!-- Vector: minimal document (گوشه کارت) -->
          <div class="p-5 sm:p-6 md:p-8">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
