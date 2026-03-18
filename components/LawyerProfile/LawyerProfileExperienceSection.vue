<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="experience"
    title="سوابق کاری">
    <div class="grid gap-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
        <p class="font-semibold text-slate-800">{{ item.position }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ item.organization }}</p>
        <p class="mt-1 text-xs text-slate-500">
          {{ yearRange(item.start_year, item.end_year) }}
          <span v-if="item.work_place">| {{ item.work_place }}</span>
        </p>
        <p v-if="item.description" class="mt-2 text-sm text-slate-600">
          {{ item.description }}
        </p>
      </article>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } });

const yearRange = (startYear, endYear) => {
  if (!startYear && !endYear) return "بدون بازه زمانی";
  if (startYear && endYear) return `${startYear} تا ${endYear}`;
  return `${startYear || endYear}`;
};
</script>
