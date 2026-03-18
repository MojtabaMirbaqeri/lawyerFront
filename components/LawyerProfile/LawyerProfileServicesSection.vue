<template>
  <LawyerProfileSectionCard
    v-if="services.length || specialties.length"
    section-id="services"
    title="تخصص‌ها و حوزه‌های فعالیت">
    <div v-if="specialties.length" class="mb-4">
      <p class="mb-2 text-sm font-semibold text-slate-700">تخصص‌ها</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="specialty in specialties"
          :key="specialty"
          class="rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          {{ specialty }}
        </span>
      </div>
    </div>

    <div v-if="services.length">
      <p class="mb-2 text-sm font-semibold text-slate-700">خدمات قابل ارائه</p>
      <ul class="space-y-2 text-sm text-slate-700">
        <li v-for="service in services" :key="service" class="flex items-center gap-2">
          <span class="h-1.5 w-1.5 rounded-full bg-primary" />
          {{ service }}
        </li>
      </ul>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({
  specialties: { type: Array, default: () => [] },
  services: { type: Array, default: () => [] },
});
</script>
