<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="languages"
    title="زبان‌ها">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="lang in items"
        :key="lang"
        class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700">
        {{ lang }}
      </span>
    </div>
  </LawyerProfileSectionCard>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } });
</script>
