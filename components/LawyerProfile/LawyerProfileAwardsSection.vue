<template>
  <LawyerProfileSectionCard
    v-if="items.length"
    section-id="awards"
    title="جوایز و افتخارات">
    <div class="grid gap-3">
      <article
        v-for="item in items"
        :key="item.id"
        class="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
        <p class="font-semibold text-slate-800">{{ item.award_name }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ item.issuing_organization }}</p>
        <p v-if="item.award_year" class="mt-1 text-xs text-slate-500">
          سال {{ item.award_year }}
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
</script>
